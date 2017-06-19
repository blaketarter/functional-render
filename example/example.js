const staticHr = '<hr />';

function Foo() {
  return {
    willMount() {
      console.log('will render Foo()');
    },
    didMount() {
      console.log('did render Foo()');
    },
    render() {
      return S.html`<h1>Foo Bar</h1>`;
    }
  };
}

function App() {
  return {
    render() {
      console.log('render log');
      return S.html`
        <div class="test">
          ${ Foo }
          ${ staticHr }
        </div>
      `;
    }
  }
}

S.mount(App, '.app');
