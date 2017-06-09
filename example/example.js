const staticHr = '<hr />';

function Foo() {
  return {
    willRender() {
      console.log('will render Foo()');
    },
    didRender() {
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
