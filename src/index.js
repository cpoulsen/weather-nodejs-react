import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
import './styles/app.scss'
import injectTapEventPlugin from 'react-tap-event-plugin';


injectTapEventPlugin();

render(<App/>, document.getElementById('main'))
