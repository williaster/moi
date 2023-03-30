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

const defaultParser = <D>(d: D) => d;

export default function useData<RawData = any, ParsedData = RawData>({
  url,
  // @ts-expect-error
  parser = defaultParser,
  responseType = 'json',
}: UseDataOptions<RawData, ParsedData>): UseDataState<ParsedData> {
  const [state, setState] = useState<UseDataState<ParsedData>>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    fetch(url, { method: 'GET', mode: 'cors' })
      .then(response => {
        if (response.status !== 200) {
          setState({ loading: false, error: new Error(response.statusText), data: null });
        } else if (responseType === 'text') {
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
  }, [parser, url, responseType]);

  return state;
}
