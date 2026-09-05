---
title: AutoHotKey
description: Global keyboard shortcuts for Windows OS, using these shortcuts to control MicroSoft PowerPoint when PowerPoint is not in the foreground.
keywords: AutoHotKey, Windows, Windows 11, Scripting, Microsoft, Power Point, PowerPoint 
author: Derek Dreblow
version: 2024-12-31
categories:
  - Windows 11
  - AutoHotKey
  - Scripting
  - Microsoft
  - PowerPoint
  - GoTo Webinar 
tags:
  - Windows 11
  - AutoHotKey
  - Scripting
  - Microsoft
  - PowerPoint
  - GoTo Webinar 
  - Global keyboard shortcuts
---

# AutoHotKey Windows PowerPoint

## Overview
I have a client, [Dreblow and Associates](https://www.dreblowandassociates.com), a company owned and operated by my family. My father, [Daniel Dreblow](https://www.linkedin.com/in/daniel-dreblow-36047824?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BaPKSL6e%2BToCTeq6fUWYwyg%3D%3D), is the Founder and President. As the head of IT, I manage the organization’s entire technical infrastructure, which includes developing and maintaining email addresses, websites, webinars, and a plethora of technical tools.

In today’s challenge, we faced an issue while using GoToWebinar to broadcast a PowerPoint presentation while speaking to potential prospects, but they encountered an issue: whenever the GoToWebinar app was in focus, the PowerPoint slideshow lost focus, making it impossible to cycle through the slides during the presentation. To solve this, I used AutoHotKey (AHK) to create global keyboard shortcuts that worked across all windows, in Widnows 11. This allowed the client to control the PowerPoint slideshow seamlessly, even while GoToWebinar was the active application. The AHK script enabled smooth transitions between slides without disrupting the webinar, ensuring a professional and hassle-free presentation experience.

This guide hopes to help those get AHK running with the provided script. The provided script interacts with Microsoft PowerPoint via PowerPoint API. When things are up and running, One will be able to control the slides via  `ctrl-left` for a previous slide and `ctrl-right` for the next slide.

---

#### 1. Download AHK
* Its recommended that one download the AutoHotKey from the [Microsoft Store - AutoHotkey](https://apps.microsoft.com/store/detail/autohotkey/9NBLGGH4NHSW)

#### 2. Creating AHK Script
Using the **PowerPoint COM API** is the most robust solution when other methods fail. Here’s a script leveraging the COM object model to control the slideshow programmatically. This will work even when PowerPoint is not the active window.
* Create a `txt` file, take the below script and paste it in the text file.
* Change the file type from `txt` to `ahk`
* PowerPoint COM API Script
    ```ahk
    #NoEnv
    SendMode Input
    SetTitleMatchMode, 2 ; Enable partial matching for window titles
    #Persistent

    ; Initialize PowerPoint COM object
    ppt := ComObjCreate("PowerPoint.Application")

    ; Next Slide: Ctrl + Right
    ^Right::
        slideShow := GetSlideShow()
        if (slideShow) {
            slideShow.View.Next
        } else {
            MsgBox, No active PowerPoint slideshow found.
        }
        return

    ; Previous Slide: Ctrl + Left
    ^Left::
        slideShow := GetSlideShow()
        if (slideShow) {
            slideShow.View.Previous
        } else {
            MsgBox, No active PowerPoint slideshow found.
        }
        return

    ; Function to get the active slideshow
    GetSlideShow() {
        global ppt
        try {
            return ppt.SlideShowWindows(1) ; Get the first active slideshow window
        } catch {
            return
        }
    }
    ```
#### 3. Launching Script
With AutoHotKey (AHK) installed and running, double-click on the .ahk file to start the script. Open a PowerPoint presentation of your choice and put it in slideshow mode. Then, open another application, such as Windows Explorer or a web browser, and position it in the foreground so that the PowerPoint presentation is visible in the background but not focused. This setup simulates the scenario where GoToWebinar (or another app) is in focus during a presentation.

Now, test the global keyboard shortcuts you set in the AHK script. Press the assigned keys to cycle through the PowerPoint slides (e.g., next or previous), ensuring the commands work seamlessly even when the PowerPoint application is not the active window. Verify that the slides transition correctly without disrupting the application in the foreground. If everything functions as expected, your script is successfully enabling smooth slide control during presentations.