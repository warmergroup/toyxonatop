import { z } from 'zod';
import type { FormError } from '#ui/types';

const createPhoneSchema = (t: ReturnType<typeof useI18n>['t']) => {
    return z.string()
        .min(1, t('validation.phoneRequired'))
        .transform((value) => value.replace(/\D/g, ''))  // Raqam bo'lmagan belgilarni olib tashlash
        .refine(
            (value) => value.length === 9,
            t('validation.phoneInvalid')
        );
};

const createLoginSchema = (t: ReturnType<typeof useI18n>['t']) => {
    return z.object({
        phone: createPhoneSchema(t),
    });
};

const createRegisterSchema = (t: ReturnType<typeof useI18n>['t']) => {
    return z.object({
        name: z.string()
            .min(1, t('validation.nameRequired'))
            .transform((value) => value.trim()),
        phone: createPhoneSchema(t),
    });
};

export const useLoginSchema = () => {
    const { t } = useI18n();
    return createLoginSchema(t);
};

export const useRegisterSchema = () => {
    const { t } = useI18n();
    return createRegisterSchema(t);
};

export const zodErrorsToFormErrors = (error: z.ZodError): FormError[] => {
    return error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
    }));
};

export const extractErrorMessage = (error: unknown): string => {
    const { t } = useI18n();
    
    if (error instanceof z.ZodError) {
        return error.errors[0].message;
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        return err.response?.data?.message || t('error.unknown');
    }
    
    return t('error.unknown');
};
