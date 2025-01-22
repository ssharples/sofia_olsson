import { useCallback } from 'react';
import { useMCPContext } from '@modelcontextprotocol/sdk/react';

export function useMCP() {
  const { callTool } = useMCPContext();

  const getImageUrls = useCallback(async (filename: string) => {
    const response = await callTool('dropbox', 'get_image_urls', { filename });
    return JSON.parse(response.content[0].text);
  }, [callTool]);

  const listImages = useCallback(async (folder: string = 'images') => {
    const response = await callTool('dropbox', 'list_images', { folder });
    return JSON.parse(response.content[0].text);
  }, [callTool]);

  return {
    callTool,
    getImageUrls,
    listImages
  };
}
