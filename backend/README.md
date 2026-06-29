
# WhyHub - Backend Setup

This section is for setting up the backend of WhyHub in your local machine.

## Setup

### 1. Create Virtual Environment
```bash
cd backend

python -m venv

# For Linux
source venv/bin/activate

# For Windows
venv\scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Generate Secret Key
This key is for signing JWT Tokens.
```bash
openssl rand -hex 32
```

### 4. Create ".env" File
In backend folder, create a ".env" file and input the following:
```bash
SECRET_KEY=(generated secret key in Step 3)

# This is the algorithm used for JWT Signing.
ALGORITHM=HS256

# This will determine how long login session lasts.
ACCESS_TOKEN_EXPIRE_MINUTES=(number of minutes)
```


### 5. Create and Run "seed.py" Script
Create a file named "seed.py" and input the following code:
```bash
from database import SessionLocal, engine, Base
from models import User
from auth import hash_password
from dotenv import load_dotenv
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

db = SessionLocal()
user = User(hashed_password=hash_password("INPUT_YOUR_PASSOWRD")
db.add(user)
db.commit()
db.close()

print("Password set successfully! Thank you, lods.")
```
Then in terminal, run:
```
python seed.py
```
This will create your login credential. 
**NOTE**: Include this file into your .gitignore.

### 6. Run the Server
In terminal, run:
```bash
uvicorn main:app --reload