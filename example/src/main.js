import {
  mount,
  html,
  Component
} from '../../src/main';

const staticHr = '<hr />';

class Foo extends Component {
  render() {
    return html`<p>Foo</p>`;
  }
}

class App extends Component {
  constructor() {
    super();
    console.log('App constructor');
  }

  willMount() {
    console.log('App willMount');
  }

  didMount() {
    console.log('App didMount');
  }
  
  render() {
    console.log('App Render');
    return html`
      <h1>Hello World</h1>
      ${ staticHr }
      ${ Foo }
    `;
  }
}

mount(App, '.app');
