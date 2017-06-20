import {
  mount,
  html,
  Component
} from '../../src/main';

const staticHr = '<hr />';

class Foo extends Component {
  constructor(props) {
    super();
    this.state = {
      bar: props.bar,
    };
  }

  render() {
    return html`<p>Foo ${ this.state.bar }</p>`;
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
    return html`
      <h1>Hello World ${ this.state }</h1>
      ${ staticHr }
      ${ Foo.setProps({ bar: 'Baz' }) }
    `;
  }
}

mount(App, '.app');
