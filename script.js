const classNameInput = document.getElementById('classNameInput');
const showChainButton = document.getElementById('showChainButton');
const outputDiv = document.getElementById('output');
showChainButton.addEventListener('click', showPrototypeChain);
async function showPrototypeChain() {
  const className = classNameInput.value.trim();

  if (className.endsWith('.js')) {
    const moduleName = className.slice(0, -3);
    try {
      const module = await import(`./${moduleName}.js`);
      if (typeof module.default === 'function') {
        classNameInput.classList.remove('error');
        displayPrototypeChain([module.default]);
      } else {
        classNameInput.classList.add('error');
        outputDiv.innerHTML = '';
      }
    } catch (error) {
      classNameInput.classList.add('error');
      outputDiv.innerHTML = '';
    }
  } else if (typeof window[className] === 'function') {
    classNameInput.classList.remove('error');

    let currentClass = window[className].prototype.constructor;
    const chain = [];

    while (currentClass !== Object) {
      chain.push(currentClass);
      currentClass = Object.getPrototypeOf(currentClass.prototype).constructor;
    }
    chain.push(Object);
    displayPrototypeChain(chain);
  } else {
    classNameInput.classList.add('error');
    outputDiv.innerHTML = '';
  }
}
function displayPrototypeChain(chain) {
  const ol = document.createElement('ol');

  chain.forEach((cls, index) => {
    const li = document.createElement('li');
    const titleProto = document.createElement('h3');
    titleProto.classList.add('title-prototype');
    titleProto.textContent = cls.name || '[Без названия]';

    const propertiesOl = document.createElement('ol');
    listPrototypeProperties(cls.prototype, propertiesOl);
    li.appendChild(titleProto);
    li.appendChild(propertiesOl);
    ol.appendChild(li);
  });
  outputDiv.innerHTML = '';
  outputDiv.appendChild(ol);
}

function listPrototypeProperties(proto, ol) {
  const properties = Object.getOwnPropertyNames(proto);
  properties.forEach(prop => {
    const li = document.createElement('li');
    const propSpan = document.createElement('span');
    const propType = document.createElement('span');
    const errorType = document.createElement('span');
    propSpan.classList.add('prop-name');
    propType.classList.add('prop-type');
    errorType.classList.add('error-type');
    propSpan.textContent = `Свойство прототипа:${prop}`
    li.appendChild(propSpan);
    ol.appendChild(li);
  });
}