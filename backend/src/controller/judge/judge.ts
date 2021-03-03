import axios, { AxiosRequestConfig } from 'axios';
import express, { Request, Response } from 'express';

const router = express.Router();

interface SubmissionRequest {
  languageId: number;
  sourceCode: string;
}

router.post('/submissions', async (req: Request, res: Response) => {
  const data = req.body as SubmissionRequest;
  const options: AxiosRequestConfig = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST
    },
    data: {
      language_id: data.languageId,
      source_code: data.sourceCode
    }
  };

  try {
    const apiRes = await axios.request(options);
    const { token } = apiRes.data;
    return res.json({ token });
  } catch (e) {
    console.error(e);
    return res.status(e.response?.status || 500).json({ e: e.message });
  }
});

router.get('/submissions/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `https://judge0-ce.p.rapidapi.com/submissions/${id}`,
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST
    }
  };

  try {
    const apiRes = await axios.request(options);
    return res.json({ id, data: apiRes.data });
  } catch (e) {
    console.error(e);
    return res.status(e.response?.status || 500).json({ e: e.message });
  }
});

export default router;
