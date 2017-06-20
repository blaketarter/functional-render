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
    this.state = 0;
    console.log('App constructor');
  }

  willMount() {
    console.log('App willMount');
  }

  didMount() {
    console.log('App didMount');
    setTimeout(() => this.setState(10), 1000);
  }
  
  render() {
    console.log('App Render');
    console.log('state: ', this.state);
    return html`
      <h1>Hello World ${ this.state }</h1>
      ${ staticHr }
      ${ Foo }
    `;
  }
}

mount(App, '.app');
