from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

def runTasteBuds(): # move into dist and run an http server for tastebuds to live on
    os.chdir(r"dist")

    server = HTTPServer(("localhost", 8000), SimpleHTTPRequestHandler)  # start a server and let pythons built in handler work its magic
    print("Serving Tastebuds on http://localhost:8000") # website is localhost:8000
    server.serve_forever()  # serve until program is closed

if __name__ == "__main__":  # run
    runTasteBuds()
