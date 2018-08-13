import subprocess
import os
import sys
import shutil

if __name__== "__main__":
    print("rm-ing node modules folders")
    # Remove node modules
    if os.path.exists('../node_modules'):
        try:
            shutil.rmtree('../node_modules')
        except OSError as e:
            print ("Error: %s - %s." % (e.filename, e.strerror))
    print("npm install prod dependencies")
    subprocess.Popen(['npm', 'install', '--production'], cwd='../').wait()
    print("run heroku en local. si tu peux acceder a localhost:5000, c'est bon :)")
    subprocess.Popen(['heroku', 'local', 'web'], cwd='../').wait()
