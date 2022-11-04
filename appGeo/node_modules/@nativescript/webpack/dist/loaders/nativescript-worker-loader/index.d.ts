/**
 * Replaces
 * new Worker('./somePath')
 * with
 * new Worker(new URL('./somePath', import.meta.url))
 */
export default function loader(content: string, map: any): void;
