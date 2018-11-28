/* Define testing functions*/
function describe(text, fn) {
  console.log('FUNCTION', text)
  fn()
}

function it(text, fn) {
  console.log('DESCRIPTION', text)
  fn()
}

function expect(arg) {
  return {
    value: arg,
    toBe(arg) {
      if (arg === this.value) {
        console.log('TEST PASSED!');
      } else {
        console.log('TEST FAILED')
      }
    }
  }
}

/*Run Tests*/

//Function : completeChecker

function completeChecker(arrayItem, val) {
  if (arrayItem.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
    let autocompleteItem = document.createElement("DIV");
    autocompleteItem.innerHTML = "<strong>" + arrayItem.substr(0, val.length) + "</strong>";
    autocompleteItem.innerHTML += arrayItem.substr(val.length);
    autocompleteItem.innerHTML += "<input type='hidden' value='" + arrayItem + "'>";
    autocompleteItem.addEventListener("click",
      function (e) {
        inp.value = this.getElementsByTagName("input")[0].value;
        // closeAllLists();
        // validateForm();
      });
    return autocompleteItem;
  }
}
//Test : completeChecker

describe('completeCheker', () => {
  it('returns a dom node if arguments match', () => {
    const item = 'FAX';
    const value = 'FA';
    const Actual = completeChecker(item, value);
    expect(Actual.nodeName).toBe('DIV')
  })
  it('returns undefined if arguments don\'t match', () => {
    const item = 'abC';
    const value = 'FA';
    const Actual = completeChecker(item, value);
    expect(Actual).toBe(undefined)
  })
})

//Function : invokeAutocomplete

function invokeAutocomplete(targetElements) {
  if (targetElements) {
    targetElements.forEach(function (input) {
      // autocomplete(input, intentChecked);
    });
    return targetElements;
  }
}
//Test : invokeAutocomplete

describe('invokeAutocomplete', () => {
  it('returns array if elements exist', () => {
    var elements = ['element'];
    const Actual = invokeAutocomplete(elements);
    expect(Actual.length).toBe(1)
  })
  it('returns undefined if elements don\'t exist on page', () => {
    var elements;
    const Actual = invokeAutocomplete(elements);
    expect(Actual).toBe(undefined)
  })
})