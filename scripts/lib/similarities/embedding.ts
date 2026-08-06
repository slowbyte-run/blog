import type { FeatureExtractionPipeline } from '@huggingface/transformers';
import type { PostData } from './types';
import { normalize } from './utils';

export async function generateEmbeddings(
  posts: PostData[],
  extractor: FeatureExtractionPipeline,
): Promise<Float32Array[]> {
  const embeddings: Float32Array[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    process.stdout.write(
      `\r  Processing ${i + 1}/${posts.length}: ${post.slug.slice(0, 40)}...`,
    );

    const output = (await extractor(post.text, {
      pooling: 'mean',
      normalize: false,
    })) as { data: Float32Array };

    embeddings.push(normalize(output.data));
  }

  return embeddings;
}
