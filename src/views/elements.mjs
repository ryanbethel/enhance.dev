import ErrorPage from './templates/error-page.mjs'
import ContentContainer from './templates/content-container.mjs'
import FlashMessage from './templates/flash-message.mjs'
import LoginPage from './templates/login-page.mjs'
import NavBar from './templates/nav-bar.mjs'
import PageHeader from './templates/page-header.mjs'
import LandingPage from './templates/landing-page.mjs'
import PlaygroundPage from './templates/playground-page.mjs'
import CodeEditor from './templates/code-editor.mjs'
import EnhancePreview from './templates/enhance-preview.mjs'
import EnhanceRunner from './templates/enhance-runner.mjs'
import MarkupPreview from './templates/markup-preview.mjs'
import TabContainer from './templates/tab-container.mjs'
import EmailSignup from './templates/email-signup.mjs'
export default {
  'flash-message': FlashMessage,
  'email-signup': EmailSignup,
  'content-container': ContentContainer,
  'error-page': ErrorPage,
  'login-page': LoginPage,
  'nav-bar': NavBar,
  'page-header': PageHeader,
  'landing-page': LandingPage,
  'playground-page': PlaygroundPage,
  'code-editor': CodeEditor,
  'tab-container': TabContainer,
  'enhance-preview': EnhancePreview,
  'enhance-runner': EnhanceRunner,
  'markup-preview': MarkupPreview
}
