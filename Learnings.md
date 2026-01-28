date 21-01-2026

1. today at current i am confused that which elements should be on UI ,on my page.i mean at current i am buildiing only parsing thing for whihc i need to have section where i can upload the file , so i am confused that should i use placeholder type of inpu feild or browse from desktop type feild .
2. its saying i have to upload the file to the inpput feild and i have to read teh code of the file using the fs system ,then i would handover it to the Babble and it would read the code and make the AST .
3. 1. uplaod the file
   2. read the code
   3. make AST.
      ....>>>>>.......<<<<<<>>>>>>
      // all these 3 steps can be performed only on the backend not on the frontend, because to read the files we need fs systems and whihc only provides by node js so we have to send the git url to the backend and it will get the job done
   4. backned would clone the repo from git (it`s very easy anyone can do it)
   5. read the files using Node fs system
   6. make the AST
   7. then main business logic would run
   8. Core logic would be perfoemed on BE,only teh result o analsyis would be shown to the FE

Date 22-01-2026

1. today first i cleande the project structer inside the project i made seprated FE and BE folders. on thing i noticed that for frontend we need Vite to run teh things so its dependies are different and for backend we need different things we need framework of NodeJS
2. Now i am going to setup the server and it would start listening the reqs.
3. Now documentayion part of express router--
4. BE will get the request on the api/git endpoint in whihc the api would forward to the gitrouter . /api---> Router--> /git .

//NOw i ma writing the gitCloning function inside the git controller .

1. rl received -->trim why??
2. every Url is different,we as develpoer can`t run checks for ever type of url so its better to convert every url into develpoer freiendly standard.
3. For this we would use URL parsing to first extract {user &repo name} then will rebuild the full URL ==>https://github.com/${user}/${repo}.git

date 27-01-2026

1. into the backend should i accept the url data inot the PArams or into the body ??
   ===> ans is use params where task is simple and whihc can`t trigger any big backend logic for example data fetching ==Simple & ask one thing can the incoming data can outgroow in future or can it become complex if not then use params.
2. todays problem==>>|
   |
   > > i was not getting the user name inside the repo log of gitclone controller, for example
   > > if i was sending ="Kunal-Pnadey1/codeBase" this i was not getting the user name into the full url it was "https://github.com//codeBase" why??
   1. becasue the url buitl-in tool thought that kunal-pandey is just after the protocol it is the domain so it skipped it and inside the path it puted the path=codebase
      "repoUrl": "Kunal-Pnadey1/codeBase"
      "ProcessedURL": "https://github.com//codeBase"
      becasue we were only checking for the protocol inside our conditions. so when it sees that http is not there it simply added it inot the repourl and when it goes to next step, for path extraction the url TOOL just skipped the user name and piccked the repo name.

SOln==>>>>|
|=> 1. Check for domain first 2. then check for protocol (becasue URl tool can`t work without prtocol)
           |   3. make sure when path extraction happens url must have the protocol +Domain 
               4. Without both the full repo path can`t be extracted.

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
