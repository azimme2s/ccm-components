# SE1 Web-App Guid
The purpous of this guid is to give a user some insights what this app for and how you can use it.
The main focus is to explain why and how some features work or didn't work.

This App is to support the course Software Engineering 1 for the University of Applied Science Bonn-Rhein-Sieg Campus  St.Augustin.
The App only works with access for the Campus System, so it will be useless for everybody else.

## What you can do with the App
This application is based on on Web technologyies, manly on the concept of PWA (Progressive Web Apps) and on the CCM (Clientside Components Modell).
The main Feature of PWAs are, that you build Web Applications that are optimais for Mobile Usages.  
For instance apperance is mobile first and you can use features direclty from the device (e.g Cam and GPS).
And that some of the features are Offline avalible. For that the PWAs use the Service Worker Technologies, which will be explained expacilly fro this App.
For more details read the following [Link from Google](https://developers.google.com/web/progressive-web-apps/).

The CCM model are developed by a R&Dler from this Campus, and what exactly is used, will this discused later on this Guide
### The Features
All the features are developed with ccm components. To make a clear overview I will list all the components in a Table and give a short description with some configuration option that are needed.
Some of the component will be a more specific explained in a later section.

| Component | Explanation |
| --- | --- |
| se1-pwa  | This Component is the main point for the hole app. Many components will be used here. For example the nav-burger menue. There for you need the Information how many Entries this menue will have. When you add the se1-pwa komponent in the index HTML you can set the inner value with a list it will look like that ```javascript
<ccm-se1-menu
        inner='[
        ["le00", "https://kaul.inf.h-brs.de/data/2017/se1/le00.html"],
        ["le01", "https://kaul.inf.h-brs.de/data/2017/se1/le01.html"],
        ["le03", "https://kaul.inf.h-brs.de/data/2017/se1/le03.html"],
        ["le04", "https://kaul.inf.h-brs.de/data/2017/se1/le04.html"],
        ["le05", "https://kaul.inf.h-brs.de/data/2017/se1/le05.html"],
        ["le06", "https://kaul.inf.h-brs.de/data/2017/se1/le06.html"],
        ["le07", "https://kaul.inf.h-brs.de/data/2017/se1/le07.html"],
        ["le08", "https://kaul.inf.h-brs.de/data/2017/se1/le08.html"],
        ["le09", "https://kaul.inf.h-brs.de/data/2017/se1/le09.html"],
        ["le10", "https://kaul.inf.h-brs.de/data/2017/se1/le10.html"],
        ["le11", "https://kaul.inf.h-brs.de/data/2017/se1/le11.html"],
        ["le12", "https://kaul.inf.h-brs.de/data/2017/se1/le12.html"]
        ]'></ccm-se1-menu>
```  |
| Content Cell  | Content Cell  |
### The Service Worker

### The Data Storage

## What you can't do with the App

## Some additional comments
