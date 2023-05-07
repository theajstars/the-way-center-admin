const validatePhone = (phone) => {
  if (phone.length > 14) {
    return false;
  } else if (phone.length < 11) {
    return false;
  } else {
    const isInvalidNum = phone.split("").map((n) => {
      return isNaN(parseInt(n));
    });
    console.log(isInvalidNum);
    const isAnyInvalid = isInvalidNum.filter((num) => num === true);
    console.log(isAnyInvalid);
    if (isAnyInvalid.length > 0) {
      return false;
    } else {
      return true;
    }
  }
};

export { validatePhone };
