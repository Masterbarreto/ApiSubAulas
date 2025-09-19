# Render Build & Deploy Configuration

## Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x (Latest LTS)

## Environment Variables (Configure in Render Dashboard)

### Database
```
MONGODB_URI=mongodb+srv://jpanela302:Master250508@subidatabase.lg744ao.mongodb.net/?retryWrites=true&w=majority
DB_NAME=SubiDataBase
```

### Server Configuration
```
PORT=10000
SESSION_SECRET=9f8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8
API_VERSION=/api/v1
NODE_ENV=production
```

### Email Configuration (Optional)
```
GMAIL_USER=devprodutions@gmail.com
GMAIL_PASS=rkvdihmfxvkliumz
```

### Analytics (Optional)
```
SEGMENT_WRITE_KEY=uXkrpNWOoZAnRxVNSP8gWGzAEoHppXUd
RESEND_API_KEY=re_M5FHtRFw_NoF9E9yZAJDFKtEoXCA95nux
```

### Auto-Ping (To keep service awake)
```
PING_URL=https://YOUR-RENDER-URL.onrender.com/api/v1/aulas/MostarAulas
```

## Important Notes

1. **Port Configuration**: Render automatically assigns PORT, do not hardcode it
2. **MongoDB**: Make sure MongoDB Atlas is accessible from anywhere (0.0.0.0/0)
3. **CORS**: Already configured for all origins in production
4. **Health Check**: Use `/api/v1/aulas/MostarAulas` as health check endpoint

## Deploy Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Sistema de conclusão por turma implementado"
   git push origin main
   ```

2. **Create New Web Service in Render**:
   - Connect GitHub repository
   - Select `ApiSubAulas` repository
   - Branch: `main`
   - Root Directory: Leave empty (uses root)

3. **Configure Build Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**:
   - Copy all variables from above
   - Make sure MONGODB_URI is correct
   - Update PING_URL with your actual Render URL

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for build and deployment
   - Test endpoints after deployment

## Testing After Deploy

### Health Check
```
GET https://your-app.onrender.com/api/v1/aulas/MostarAulas
```

### Create Test Lesson
```
POST https://your-app.onrender.com/api/v1/aulas
Content-Type: application/json

{
  "anoEscolar": "3ano",
  "curso": ["iot"],
  "titulo": "Teste Produção",
  "Turma": ["1", "2"],
  "Materia": "FTP",
  "DayAula": "2025-09-20",
  "professor": "Teste"
}
```

### Test Class Completion by Specific Class
```
PATCH https://your-app.onrender.com/api/v1/aulas/{AULA_ID}/concluir
Content-Type: application/json

{
  "turma": "1"
}
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Node.js version compatibility
- Check build logs for specific errors

### Runtime Errors
- Verify environment variables are set correctly
- Check MongoDB connection string
- Review application logs in Render dashboard

### Database Connection Issues
- Ensure MongoDB Atlas allows connections from anywhere
- Verify connection string includes correct credentials
- Check that database name exists

### Performance Issues
- Monitor Render logs for memory usage
- Consider upgrading Render plan if needed
- Optimize database queries if response is slow