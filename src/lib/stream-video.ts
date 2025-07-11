import "server-only"; // Ensure this file is only used on the server side

import {StreamClient} from '@stream-io/node-sdk';

export const streamVideo = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
    process.env.STREAM_VIDEO_SECRET_KEY!
)

