export const useFormat = () => {
  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, ''); //998 97 030 29 31
    if (digits.length !== 12) return phone;
    return `${digits.slice(0,3)} ${digits.slice(3,5)} ${digits.slice(5,8)} ${digits.slice(8,10)} ${digits.slice(10,12)}`;
  }

  const formatPrice = (value: number | string): string => {
    const number = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('uz-UZ').format(number)
  }

  const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return {
    formatPhone,
    formatPrice,
    formatDate,
  };
};
