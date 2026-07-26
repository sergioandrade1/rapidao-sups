/**
 * Imagens dos produtos, extraídas do catálogo da loja atual (Vendizap).
 *
 * ATENÇÃO — isto aponta para o CDN da Vendizap. Serve para a fase de design,
 * mas NÃO deve ir para produção assim: se a loja sair da Vendizap, as imagens
 * somem. Na fase Supabase, baixar os arquivos e subir para o Storage, trocando
 * apenas a constante BASE abaixo.
 */
const BASE = "https://cdn.vendizap.com/vendizap-produtos-thumbs/";

/** slug do nosso catálogo -> arquivo no CDN */
const ARQUIVOS = {
  "combo-max-titanium-100-whey-creatina-monohidratada": "bdc3bc4f2e1b56c459a986270e1c02ed.webp",
  "combo-emagrecimento-under-labz": "5d33d1417df8c2dd7af68283e9a7ce68.webp",
  "combo-nutrata-creatina-300g-whey-npro-900g": "0762289dab8f6bf432c678ca4b3573f3.webp",
  "creatina-100-pura-monohidratada-1kg": "7104fdf2ae1d5ccd1c6db936a5d8a637.webp",
  "combo-shark-pro": "b97d4f36e3b4b89f030a12d93b044643.webp",
  "combo-integral-medica-whey-900g-creatina-300g": "9594a4f30f8f1d8e91bb3ef5f37477b2.webp",
  "2x-creatina-100-pura-monohidratada-300g-cada": "689d8592343e87650d68b18062dbb615.webp",
  "supercoffee-380g": "8a4e6bbeea5cf9670ca98de781dd47b8.webp",
  "2x-max-100-concentrado-900g-cada": "efc674e8a493c4a1f26fafdc7ce46be3.webp",
  "100-whey-gold-standard-900g": "bf12a9a0f27d6bcbf01946e22042b60a.jpg",
  "creafort-300g-com-selo-creapure": "1989f6a36ccb30e67b73211f617c5a3f.webp",
  "thermo-flame-120-caps": "51073cb125dc055bdd13644b7382068f.webp",
  "multimax-complex-90-caps": "4b64a8b9f00307eae4547efa0ac1e025.jpg",
  "hi-mass-prime-15000-3kg": "fe58d88333b0060692142eb8e07b77b3.jpg",
  "100-whey-900g": "62bd9d45d22f521dd771a5802f35c033.jpg",
  "adaptogen-tasty-whey-3w-gourmet-912g": "44ab40b80c2e82af9a24e4c40a223912.jpg",
  "100-prime-whey-900g": "763b6299fe79defeff3e957d8b61f80f.webp",
  "the-pumpfather-300g": "7114ac9d5f73cc41e4ca98397251b31d.jpg",
  "combo-emagrecimento-sineflex-t-sek": "48312ad8d409a0e838229d8c7036ee99.jpg",
  "pasta-de-amendoim-gourmet-650g": "28b0a1cd3e8393ba05d114b1f16b8cd5.jpg",
  "coqueteleira-600ml": "61a1401c2a7316a0ac7be66c443b7280.jpg",
  "pasta-de-amendoim-integral-tradicional-1kg": "034f94404e0cff4ef3c4b12325e02c63.jpg",
  "creatina-turbo-150g": "28192e578842ce0ab942170a48ff5a79.jpg",
  "sense-bar-15g-unidade": "32ae66b82bcf85dc193ee5ddc72845cb.jpg",
  "c4-the-chosen-one-pre-treino-200g": "faf5c094c0fdca4a76eba32a41c06e4d.webp",
  "beta-alanine-100g": "5658fd1035fb83a7f7228fd3ea7a3448.webp",
  "melatonina-3mg-100-capsulas": "f12447062b5e5f94ea5668d15d977c17.jpg",
  "bcaa-fix-darkness-120-tabs": "00c5b616b16a9fca6a6f355ba36a5250.jpg",
  "life-vegan-450g": "c6c9963b60aded3e2a79ed86d2b3238e.jpg",
  "dextrose-1kg": "fc1645eebdfd9439e66b264a348d5c3f.jpg",
  "vitamina-d3-10-000ui-30-softgels": "6384f3e684adbcd401001a71c82097c2.jpg",
  "galao-1l": "9c0aa7e352a2549130346ff75f9b0adf.jpg",
  "complex-a-z-com-omega-3-60-caps": "4fa67b424daebfd6714b7f2eb526a23e.jpg",
  "simfort-plus-60-caps": "fe23c8a769d5b134c731bb8645896fc3.jpg",
  "pre-hormonal-testodrol-gh-60-tabletes": "1c17e23c2b3e442b3d49f512579f77ac.webp",
  "kit-com-5-mini-bands": "54172beba38b29549951d886685fdbdc.jpg",
  "tribulus-terrestris-trib-x-1200mg-100-tabletes": "7ab22addda4aad79d07d965cb87a2309.jpg",
  "maca-peruana-1000mg": "d14bd887ab7348c2c94a99b0263880e9.jpg",
  "mega-pack-hardcore-30-packs": "de46d940842d68a53436f34aaacc9e23.jpg",
  // Colágeno Verisol não existe no catálogo atual — segue no placeholder.
};

/** Devolve a lista de imagens de um produto (vazia quando não há foto). */
export function imagensDoProduto(slug) {
  const arquivo = ARQUIVOS[slug];
  return arquivo ? [BASE + arquivo] : [];
}
