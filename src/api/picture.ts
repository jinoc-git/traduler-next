import { v4 as uuidv4 } from 'uuid';

import { createClientFromClient } from '@/utils/supabase/client';

const supabaseClientClient = createClientFromClient();

export const addPictures = async (fileList: File[], planId: string) => {
  const pathList: string[] = [];

  for (const file of fileList) {
    const { data } = await supabaseClientClient.storage
      .from('add-photo')
      .upload(`${planId}/${uuidv4()}`, file);

    if (data) {
      const URL = `${process.env.NEXT_PUBLIC_SB_STORAGE_URL}/add-photo/${data.path}`;
      pathList.push(URL);
    }
  }

  return pathList;
};
