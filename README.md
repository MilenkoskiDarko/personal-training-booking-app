## Personal Training Booking

Booking app for personal trainer. The trainer publishes available sessions and clients book session with their name,mail and training goal. 
After booking AI-generated confimirmation message is displayed using gemini api-key.

#### Live frontend -> https://personal-training-booking-app.vercel.app
#### Live backend -> https://personal-training-booking-app.onrender.com/sessions

### Features

#### For clients
- Available sessions, grouped by day and shows in local time
- Booking form with name,mail,training goal and optional message for the trainer
- Instant confirmation followed by AI-generated message for the client
- Blocked double booking, if 2 client book the same session the second client will see the message "Someone just grabbed this one"

#### For the trainer
- Create sessions with date,duration,start time and type
- See who booked each session with their name, mail, goal and optional message
- Delete not reserved sessions

### Tech Stack
##### Frontend -> React,TypeScript,Vite,Tailwind CSS,React Router; Hosting -> Vercel.
##### Backend -> NestJS(TypeScript); Hosting-> Render
##### Database -> PostgreSQL with Prisma 7; Hosting -> Neon
##### AI -> Google Gemini API

### Key factors
- Double bookings are prevented by the database -> Booking.SessionId has unique constraint
- The AI is kept off the critical path -> Free tier gemini api key is not reliable,so first of all the sessions is booked and confirmed,
after that a message "Your trainer is writing a message for you" appears. Booking cannot be breaked.
- Business details in one config file -> All the key details for the business are located in client/src/config.ts
Re-theming this app for another business is mostly editing this file.

### Run it locally
Requierements: NodeJS 20 or newer nad PostgreSQL(Neon)

#### 1. Backend
cd server <br>
npm install
cp .env.example .env      # then fill in the values <br>
npx prisma migrate deploy # creates the tables <br>
npx prisma generate       # generates the Prisma client <br>
npm run start:dev         # runs on http://localhost:3000 <br>

#### 2. Frontend
cd client <br>
npm install <br>
npm run dev               # runs on http://localhost:5173 <br>
    
### AI Tools Used

#### 1. Claude
- Used claude to plan out the architecture and the build plan.
- My previous backend experience was in Springboot so i used claude to quickly learn,adapt and understand the new technology.
- Used for connecting to Neon,Vercel and Render as i came across them for the first time.
- Debugging TypeScript and I had problems with Gemini's free key-api(outdated, slow responses).

#### 2. Make.com
##### Automated mail reminders

A Make.com scenario runs every morning at 07:00 and emails clients who have a session today or tomorrow.

<img width="1463" height="808" alt="image" src="https://github.com/user-attachments/assets/c9fc5d85-bdb6-45b2-ae92-0782f7274991" />

1. **HTTP** calls the live API (`GET /sessions`)
2. **Iterator** handles one session at a time
3. **Router** splits them into two routes with filters: *today* and *tomorrow*
4. **Google Gemini** writes a personal reminder based on the client's goal and note
5. **Gmail** sends it to the client

Blueprint: [Trainer Booking reminders.blueprint.json](https://github.com/user-attachments/files/34025345/Trainer.Booking.reminders.blueprint.json)


    
###  What would I improve with more time
- First of all i would update the UI becouse it was build quickly to fit the 2-hour challange.
- I would introduce authentication and logging in (trainer and client), so the app would be really usable.
- Add group sessions(limited number of clients per session) and nutrition counseling sessions.
- Implement notifications for both trainer and client, reminders that they have session in 2 hours for example.
- Implement cancel or reschedule.



