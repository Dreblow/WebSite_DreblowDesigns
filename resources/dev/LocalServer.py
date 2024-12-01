import http.server
import socketserver

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add Cache-Control header
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

# Define the port
PORT = 8000

try:
    # Start the server
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer interrupted. Shutting down gracefully...")
    httpd.server_close()