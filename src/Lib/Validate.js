const validatePhone = (phone) => {
  if (phone.length > 14) {
    return false;
  } else if (phone.length < 11) {
    return false;
  } else {
    const isInvalidNum = phone.split("").map((n) => {
      if (n !== "+") {
        return isNaN(parseInt(n));
      } else {
        return false;
      }
    });
    const isAnyInvalid = isInvalidNum.filter((num) => num === true);
    if (isAnyInvalid.length > 0) {
      return false;
    } else {
      return true;
    }
  }
};

export { validatePhone };
