import { useEffect, useState } from 'react';

export interface UseDataOptions<RawData, ParsedData> {
  parser?: (rawData: RawData) => ParsedData;
  url: string;
  responseType?: 'json' | 'text';
}

interface UseDataState<ParsedData> {
  loading: boolean;
  data: ParsedData | null;
  error: Error | null;
}

export default function useData<RawData = any, ParsedData = RawData>({
  url,
  parser = (d: RawData) => d,
  responseType = 'json',
}: UseDataOptions<RawData, ParsedData>) {
  const [state, setState] = useState<UseDataState<ParsedData>>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    fetch(url, { method: 'GET', mode: 'cors' })
      .then(response => {
        if (responseType === 'text') {
          response.text().then(text => {
            setState({
              loading: false,
              data: parser((text as unknown) as RawData),
              error: null,
            });
          });
        } else {
          response.json().then(json => {
            setState({
              loading: false,
              data: parser(json),
              error: null,
            });
          });
        }
      })
      .catch((error: Error) => {
        console.warn(`Error fetching data at url: "${url}"`, error);
        setState({ loading: false, error, data: null });
      });
  }, [url, responseType]);

  return state;
}
