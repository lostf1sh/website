import { ref, reactive } from 'vue';

// Global reactive state that persists across page navigation
const lanyardData = reactive({
  discordUser: null,
  spotify: null,
  discordStatus: 'offline',
  discordStatusColor: 'text-catppuccin-subtle',
  vscodeActivity: null,
  isConnected: false,
  isLoading: true,
  lastUpdated: null
});

// Cache key for localStorage
const CACHE_KEY = 'lanyard_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class LanyardService {
  constructor() {
    this.ws = null;
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.userId = '470904884946796544';
    this.isConnecting = false;
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    lanyardData.isLoading = true;

    try {
      this.ws = new WebSocket('wss://api.lanyard.rest/socket');

      this.ws.onopen = () => {
        console.log('Lanyard WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        lanyardData.isConnected = true;

        // Subscribe to user updates
        this.ws.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: this.userId }
        }));
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing Lanyard message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('Lanyard WebSocket closed:', event.code, event.reason);
        this.isConnecting = false;
        lanyardData.isConnected = false;

        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
          this.heartbeatInterval = null;
        }

        // Only attempt reconnection if it wasn't a manual close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('Lanyard WebSocket error:', error);
        this.isConnecting = false;
        lanyardData.isConnected = false;
      };

    } catch (error) {
      console.error('Error creating Lanyard WebSocket:', error);
      this.isConnecting = false;
      lanyardData.isLoading = false;
      this.scheduleReconnect();
    }
  }

  handleMessage(message) {
    switch (message.op) {
      case 1: // Hello - start heartbeat
        this.startHeartbeat(message.d.heartbeat_interval);
        break;

      case 0: // Event
        if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
          this.updatePresenceData(message.d);
          lanyardData.isLoading = false;
        }
        break;
    }
  }

  updatePresenceData(data) {
    if (data.discord_user) {
      lanyardData.discordUser = {
        username: data.discord_user.username,
        discriminator: data.discord_user.discriminator,
        avatar: data.discord_user.avatar,
        id: data.discord_user.id
      };
    }


    if (data.spotify) {
      lanyardData.spotify = {
        song: data.spotify.song,
        artist: data.spotify.artist,
        track_id: data.spotify.track_id
      };
    } else {
      lanyardData.spotify = null;
    }


    if (data.discord_status) {
      lanyardData.discordStatus = data.discord_status;
      lanyardData.discordStatusColor = data.discord_status === 'online'
        ? 'text-catppuccin-gold'
        : 'text-catppuccin-subtle';
    }

    if (data.activities) {
      lanyardData.vscodeActivity = data.activities.find(activity =>
        activity.name === 'Visual Studio Code' ||
        activity.name === 'Code'
      );
    } else {
      lanyardData.vscodeActivity = null;
    }
  }

  startHeartbeat(interval) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ op: 3 }));
      }
    }, interval);
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.log(`Scheduling Lanyard reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    lanyardData.isConnected = false;
  }

  // Get current data
  getData() {
    return lanyardData;
  }

  // Force reconnect
  reconnect() {
    this.disconnect();
    setTimeout(() => this.connect(), 100);
  }
}

// Create singleton instance
const lanyardService = new LanyardService();

// Auto-connect when service is imported
lanyardService.connect();

export { lanyardService, lanyardData };