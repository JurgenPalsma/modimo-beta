import subprocess
import os
import sys
import shutil

if __name__== "__main__":

    # Remove node modules
    if os.path.exists('../node_modules'):
        try:
            shutil.rmtree('../node_modules')
        except OSError as e:
            print ("Error: %s - %s." % (e.filename, e.strerror))

    subprocess.Popen(['npm', 'install', '--production'], cwd='../').wait()
    subprocess.Popen(['heroku', 'local', 'web'], cwd='../').wait()

    #subprocess.call(['npm', 'install', '../', '--production'])
    #subprocess.call(['heroku', 'local', 'web', '../'])

