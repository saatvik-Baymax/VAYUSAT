import http.server
import socketserver
import os
import sys

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Change directory to ensure we serve the correct files
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"\n========================================================")
    print(f"🚀 Team Vayusat space-themed website is running locally!")
    print(f"👉 Open your browser at: http://localhost:{PORT}")
    print(f"========================================================\n")
    print("Press Ctrl+C in the terminal to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping local server. Goodbye!")
        sys.exit(0)
