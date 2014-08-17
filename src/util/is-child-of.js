module.exports = function(el, possibleParent) {
  while (el.parentElement)
    if (el.parentElement === possibleParent)
      return true;
    else
      el = el.parentElement;

  return false;
};
