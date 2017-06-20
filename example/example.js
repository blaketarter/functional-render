const staticHr = '<hr />';

function Foo() {
  console.log('Foo() constructor');
  
  return {
    willMount() {
      console.log('will render Foo()');
    },
    didMount() {
      console.log('did render Foo()');
    },
    render() {
      console.log('render Foo()');
      
      return S.html`<h1>Foo</h1>`;
    }
  };
}

function Bar() {
  return {
    render() {
      return S.html`<i>Bar</i>`;
    }
  };
}

function Fizz() {
  return {
    render() {
      return S.html`
        <p>
          <b>Fizz</b>
          ${ Buzz }
        </p>
      `;
    }
  }
}

function Buzz() {
  return {
    render() {
      return S.html`<b>Buzz</b>`;
    }
  }
}

function App() {
  return {
    render() {      
      return S.html`
        <div class="test">
          ${ Foo }
          ${ staticHr }
          ${ Bar }
          ${ staticHr }
          ${ Fizz }
        </div>
      `;
    }
  }
}

S.mount(App, '.app');
