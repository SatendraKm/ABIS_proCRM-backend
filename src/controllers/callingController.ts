import { Request, Response } from 'express';
import axios from 'axios';

export const getAuthToken = async (req: Request, res: Response) => {
  try {
    const vodafoneAuthUrl = 'https://cts.myvi.in:8443/Cpaas/api/clicktocall/AuthToken';
    const authBody = {
      username: process.env.VODAFONE_USERNAME || 'ABIS123',
      password: process.env.VODAFONE_PASSWORD || 'ABIS@123',
    };

    const response = await axios.post(vodafoneAuthUrl, authBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Assuming the Vodafone API returns the token in the response
    const token = response.data; // Adjust this based on the actual response structure
    console.log(token, '----------------');

    res.json({ token });
  } catch (error) {
    console.error('Error obtaining auth token:', error);
    res.status(500).json({ message: 'Error obtaining auth token', error });
  }
};

export const initiateCall = async (req: Request, res: Response) => {
  try {
    // Extract the bearer token from the request headers
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No bearer token provided' });
    }

    const token = bearerToken.split(' ')[1];

    // The URL of the Vodafone Click-to-Call API
    const vodafoneApiUrl = 'https://cts.myvi.in:8443/Cpaas/api/clicktocall/initiate-call';

    // Forward the request body to the Vodafone API
    const vodafoneResponse = await axios.post(vodafoneApiUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Send the Vodafone API response back to the client
    res.status(vodafoneResponse.status).json(vodafoneResponse.data);
  } catch (error) {
    console.error('Error initiating call:', error);
  }
};
