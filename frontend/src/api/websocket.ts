class WebSocketService {
  private socket: WebSocket | null = null;
  private messageListeners: ((message: any) => void)[] = [];

  public connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageListeners.forEach((listener) => listener(message));
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public addMessageListener(listener: (message: any) => void) {
    this.messageListeners.push(listener);
  }

  public removeMessageListener(listener: (message: any) => void) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }
}

export default new WebSocketService();
