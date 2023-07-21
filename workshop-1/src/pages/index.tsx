import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [token, setToken] = useState('');
  const [validated, setValidated] = useState('');
  const [keyword, setKeyword] = useState('');
  const [tokenToValidate, setTokenToValidate] = useState('');
  const [error, setError] = useState('');

  const handleGenerateToken = async (): Promise<void> => {
    const requestData = { id: keyword };

    const res = await fetch('http://localhost:5000/', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = (await res.json()) as unknown as { token: string };
    setToken(data.token);
  };

  const handleValidateToken = async (): Promise<void> => {
    setValidated('');

    const finalToken = tokenToValidate || token;

    const res = await fetch('http://localhost:3000/api/token', {
      method: 'POST',
      body: finalToken,
      headers: { 'Content-Type': 'html/text' },
    });

    if (!res.ok) {
      if (res.status === 400) {
        console.log(res);

        const errorData = (await res.json()) as unknown as { error: string };

        console.log(errorData.error);

        setError(errorData.error);
        return;
      } else {
        throw new Error('Failed to fetch data');
      }
    }

    setError('');

    const data = (await res.json()) as unknown as { token: string };
    setValidated(JSON.stringify(data, undefined, 2));
  };

  return (
    <main
      className={`flex min-h-screen flex-row gap-8 items-stretch justify-between p-8 ${inter.className}`}
    >
      <div className='w-1/2 pt-40 flex flex-col items-start gap-4'>
        <label className='flex flex-row gap-4'>
          <span className='font-bold'>Id</span>
          <input
            type='text'
            className='px-2 text-black bg-stone-300 rounded-sm'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>

        <button type='button' className='button' onClick={handleGenerateToken}>
          Generate Token
        </button>

        {}
        <div className='font-bold'>Generated token</div>
        <div className='break-all'>{token}</div>
      </div>
      <div className='my-8 border-r border-stone-300'></div>
      <div className='w-1/2 pt-40 flex flex-col items-start gap-8'>
        <label className='flex flex-col gap-4 w-full'>
          <span className='font-bold'>Token</span>
          <textarea
            rows={10}
            className='p-2 text-black bg-stone-300 resize-none rounded-sm'
            value={tokenToValidate}
            onChange={(e): void => setTokenToValidate(e.target.value)}
          />
        </label>
        <div className='flex flex-col gap-4 items-start'>
          <button
            type='button'
            className='button'
            onClick={handleValidateToken}
          >
            Validate Token
          </button>
          {validated && (
            <>
              <span className='font-bold'>Result</span>
              <pre>{validated}</pre>
            </>
          )}
          {error && <span className='text-red-400'>{error}</span>}
        </div>
      </div>
    </main>
  );
}
