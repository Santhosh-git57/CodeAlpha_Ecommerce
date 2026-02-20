# HeartCircle - CodeAlpha Internship Task 2

## 1. Project Title
**HeartCircle: Mini Social Media Platform**

## 2. Short Overview
HeartCircle is a mini social media web app built for **CodeAlpha Task 2**.  
Users can create an account, update profile details, post content with images, like posts, comment, and follow other users.  
This project helped me understand full-stack development in a practical, beginner-friendly way.

## 3. Features
- User registration and login with JWT authentication
- User profile with bio and profile picture upload/delete
- Create posts with text and optional image
- Global feed showing latest posts first
- Like and unlike posts
- Comment on posts
- Follow and unfollow other users
- Edit and delete own posts
- Logout support

## 4. Technologies Used
- **HTML**: Used to build page structure (Login, Register, Feed, Profile)
- **CSS**: Used for styling, layout, and responsive design
- **JavaScript (Vanilla)**: Handles frontend interactions and API calls
- **Node.js**: JavaScript runtime for backend server
- **Express.js**: Backend framework to build REST APIs
- **MongoDB**: Database to store users, posts, comments, followers
- **Mongoose**: ODM for MongoDB schema/model handling
- **JWT (jsonwebtoken)**: Used for secure authentication token
- **Multer**: Used for image upload handling
- **bcryptjs**: Used to hash user passwords securely

## 5. Installation Steps
1. Clone or download this project.
2. Open terminal in project root folder.
3. Install dependencies:

```bash
npm install
```

4. Create `.env` file from sample:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

5. Update `.env` values (especially `MONGO_URI` and `JWT_SECRET`).

## 6. How to Run the Project
1. Make sure MongoDB is running (local or Atlas).
2. Start the server:

```bash
npm run dev
```

3. Open browser and go to:

```text
http://localhost:5000
```

4. Test flow:
- Register new user
- Login
- Create post
- Like/comment/follow
- Open profile and edit/delete photo or posts

## 7. Folder Structure
```text
Social Media Platform/
+-- backend/
¦   +-- config/
¦   ¦   +-- db.js
¦   +-- middleware/
¦   ¦   +-- auth.js
¦   +-- models/
¦   ¦   +-- User.js
¦   ¦   +-- Post.js
¦   +-- routes/
¦   ¦   +-- auth.js
¦   ¦   +-- users.js
¦   ¦   +-- posts.js
¦   +-- uploads/
¦   +-- server.js
+-- frontend/
¦   +-- css/
¦   ¦   +-- style.css
¦   ¦   +-- default-avatar.svg
¦   +-- js/
¦   ¦   +-- common.js
¦   ¦   +-- login.js
¦   ¦   +-- register.js
¦   ¦   +-- feed.js
¦   ¦   +-- profile.js
¦   +-- login.html
¦   +-- register.html
¦   +-- feed.html
¦   +-- profile.html
+-- .env.example
+-- package.json
+-- README.md
```

## 8. Screenshots / Output Placeholders
- Login Page Screenshot: `[Add screenshot here]`
- Register Page Screenshot: `[Add screenshot here]`
- Feed Page Screenshot: `[Add screenshot here]`
- Profile Page Screenshot: `[Add screenshot here]`

## 9. Output Explanation
When the project runs, users can create an account and log in securely. After login, they can create posts with optional images, view all posts in the feed, like and comment on posts, and follow/unfollow other users. In the profile page, users can update bio, upload or delete profile photo, and manage their own posts (edit/delete). This gives a complete mini social media experience.

## 10. Challenges Faced
- Handling multiple API flows (auth, posts, users) and keeping frontend/backend routes aligned.
- Managing image upload and update logic for both profile pictures and post images.
- Fixing request/response errors in frontend when backend returned non-JSON responses.

## 11. Future Improvements
- Add search for users and posts.
- Add notification system for likes/comments/follows.
- Add pagination for feed.

## 12. Conclusion
This project gave me solid hands-on full-stack practice, and thank you CodeAlpha for the learning opportunity.
