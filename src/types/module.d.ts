declare module 'sockjs-client/dist/sockjs' {
  import SockJS from 'sockjs-client'

  export default SockJS
}

declare module 'stompjs' {
  const Stomp: any
  export default Stomp
}
