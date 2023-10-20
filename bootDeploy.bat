cd C:\Users\vladb\IdeaProjects\splitguru-web
npm run build
rmdir C:\Users\vladb\IdeaProjects\splitguru\sharebill-web\src\main\resources\static\*
xcopy C:\Users\vladb\IdeaProjects\splitguru-web\build\* C:\Users\vladb\IdeaProjects\splitguru\sharebill-web\src\main\resources\static /s /e