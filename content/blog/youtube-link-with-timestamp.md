---
title: "How to Share a YouTube Link with a Timestamp"
description: "Create a YouTube link that starts at a specific time on desktop or mobile. Learn timestamp formats, how to test the link, and when chapters are a better fit."
date: "2026-11-17"
author: "Convaudit Team"
tags: ["YouTube link with timestamp", "share YouTube video at specific time", "YouTube timestamp link"]
toolSlug: "youtube-timestamp-link-generator"
coverImage: ""
---

To share a YouTube video from a specific moment, add a time parameter to its URL or use the video's Share controls if they offer a start-time option. For example, a link ending in `?t=90` starts at 90 seconds. Test the link before sending it, especially if the video URL already contains other parameters.

## How do you create a YouTube link that starts at a certain time?

1. Open the video and find the moment you want someone to see.
2. Convert that time to seconds. For example, 1 minute and 30 seconds is 90 seconds.
3. Add the time to the video's URL as `?t=90` or use the Share dialog's start-time control when available.
4. Open the copied link in a new tab or browser to confirm it points to the right video and moment.

You can create a link with the [YouTube Timestamp Link Generator](/tools/youtube-timestamp-link-generator): paste a video URL, enter the time, and copy the generated link. It accepts common time formats such as seconds or hours, minutes, and seconds.

## Where does the timestamp go in a YouTube URL?

For a short `youtu.be` link, put `?t=` after the video ID:

`https://youtu.be/VIDEO_ID?t=90`

For a standard watch link, use `&t=` when the URL already has a question mark introducing its video ID:

`https://www.youtube.com/watch?v=VIDEO_ID&t=90`

The number is the start time in seconds. If the link already has other parameters, add the timestamp with an ampersand (`&`), not a second question mark. If it already has a `t` parameter, replace that value rather than adding a second one. Keep the full URL when you share it so the time information is not lost.

## How do you share a timestamped link from a phone?

Copy the video's link from the YouTube app or mobile browser, then generate a timestamped version with a link tool or edit the URL if you are comfortable doing so. Open the result in a browser or the YouTube app to check that it starts at the intended part. App behavior can vary by device and link handler, so test the same type of link your recipient will use when the exact moment matters.

If you are sharing from a desktop browser, look in YouTube's Share dialog for a start-time option. When available, set the time before copying the link. This avoids manually editing the URL, but still check the result after copying.

## Is a timestamped link the same as a YouTube chapter?

No. A timestamped link sends someone to one starting point in a video. Chapters are a labeled table of contents displayed along the video's timeline and are usually added to the description. Use a link when you want to point a person directly to a moment; use chapters when viewers should be able to browse several sections.

For guidance on adding section markers to a description, see our guide to [writing a useful YouTube video description](/blog/youtube-video-description-guide). Make sure the chapter labels and times match the final edited video.

## What are common questions about YouTube timestamp links?

### How do I add a timestamp to a YouTube URL?

Add a time parameter such as `?t=90` to a short link, or `&t=90` to a standard watch URL that already contains a query parameter. Replace `90` with the start time in seconds. If the URL already contains other parameters, use an ampersand to add the timestamp.

### How do I convert minutes and seconds to a timestamp?

Multiply the number of minutes by 60, then add the remaining seconds. For example, 2 minutes and 15 seconds is `(2 × 60) + 15`, or 135 seconds. For times that include hours, convert each hour to 3,600 seconds and each minute to 60 seconds before adding.

### Do timestamped YouTube links work on mobile?

They can open in the YouTube app or a mobile browser, depending on the device's link settings. Test the copied URL on a phone if you are sending it to mobile viewers, and confirm it opens the right video at the intended point.

### How do I share a YouTube video at a specific time without editing the URL?

Use the video's Share dialog and choose its start-time option if it is available. You can also paste the video URL into the [timestamp link generator](/tools/youtube-timestamp-link-generator), enter the desired time, and copy the result.
