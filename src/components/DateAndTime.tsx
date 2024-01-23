type DateAndTimeType = {
  initDate: number;
  type?: 'date' | 'time' | 'dateAndTime';
};

const DateAndTime = ({ initDate, type = 'dateAndTime' }: DateAndTimeType) => {
  const result = (() => {
    const date = new Date(initDate);
    switch (type) {
      case 'date':
        return (
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1)) +
          '-' +
          (date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate().toString())
        );
      case 'dateAndTime':
        return (
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1)) +
          '-' +
          (date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate().toString()) +
          '-' +
          date.getHours() +
          '시 ' +
          date.getMinutes() +
          '분 '
        );
      case 'time':
        return date.getHours() + '시 ' + date.getMinutes() + '분 ';
    }
  })();

  return <>{result}</>;
};

export default DateAndTime;
