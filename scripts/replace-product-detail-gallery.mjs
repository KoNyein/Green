import fs from "node:fs";
const path = "client/src/pages/GwavePages.tsx";
let source = fs.readFileSync(path, "utf8");
const start = source.indexOf("export function ProductDetail");
const end = source.indexOf("export function StrainDetail", start);
if (start < 0 || end < 0) throw new Error("ProductDetail boundaries not found");
const replacement = `export function ProductDetail({ productId }: { productId: number }) {
  const { copy } = useGwaveCopy();
  const detail = trpc.gwave.catalogue.detail.useQuery({ productId });
  const reserve = trpc.gwave.orders.reserveStock.useMutation();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reservationKey, setReservationKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  if (detail.isLoading) return <div className="mx-auto max-w-[1200px] px-4 py-20 text-sm text-white/55">{copy("Loading product record…", "Product record ဖတ်နေသည်…")}</div>;
  if (!detail.data) return <div className="mx-auto max-w-[1200px] px-4 py-20"><EmptyState title={copy("Product unavailable", "Product မရရှိနိုင်ပါ")}>{copy("This product is unavailable or requires a different access level.", "ဤ product သည် မရရှိနိုင်ပါ သို့မဟုတ် အခြား access level လိုအပ်ပါသည်။")}</EmptyState></div>;
  const { product, variants, images } = detail.data;
  const selectedVariant = variants.find(variant => variant.id === selectedVariantId) ?? variants[0];
  const gallery = images.length ? images : [{ id: 0, storageUrl: product.name.toLowerCase().includes("shirt") ? "/manus-storage/gwave-merch-tshirt_b4d9af90.jpg" : product.name.toLowerCase().includes("shoe") ? "/manus-storage/gwave-merch-footwear_47b84e6e.jpg" : "/manus-storage/gwave-merch-objects_2fc5b2d4.jpg", altText: product.name, sortOrder: 0 }];
  const reserveSelected = async () => {
    if (!selectedVariant || selectedVariant.stock < 1) return;
    try {
      const result = await reserve.mutateAsync({ variantId: selectedVariant.id, quantity: 1 });
      setReservationKey(result.reservationKey);
      window.localStorage.setItem("gwave-reservation-v1", JSON.stringify({ reservationKey: result.reservationKey, variantId: selectedVariant.id, expiresAt: result.expiresAt }));
      setNotice(copy("Stock reserved for 15 minutes. Continue to checkout before it expires.", "Stock ကို ၁၅ မိနစ်အတွက် reserve လုပ်ပြီးပါပြီ။ မကုန်မီ checkout ဆက်လုပ်ပါ။"));
    } catch { setNotice(copy("This stock is no longer available. Refresh and choose another variant.", "ဤ stock မရရှိနိုင်တော့ပါ။ Refresh လုပ်ပြီး အခြား variant ရွေးပါ။")); }
  };
  const checkoutHref = reservationKey ? "/checkout?product=" + product.id + "&variant=" + (selectedVariant?.id ?? "") + "&reservation=" + encodeURIComponent(reservationKey) : "/checkout?product=" + product.id + (selectedVariant ? "&variant=" + selectedVariant.id : "");
  return <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8"><SectionKicker>{product.category} / {copy("Product record", "Product record")}</SectionKicker><div className="mt-4 grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
    <div><div className="aspect-square overflow-hidden border border-white/20 bg-[#050505]"><img src={gallery[activeImage].storageUrl} alt={gallery[activeImage].altText} className="h-full w-full object-cover" /></div><div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">{gallery.map((image, index) => <button type="button" key={image.id} onClick={() => setActiveImage(index)} className={"aspect-square overflow-hidden border " + (activeImage === index ? "border-[#8bd32c]" : "border-white/20")} aria-label={image.altText}><img src={image.storageUrl} alt="" className="h-full w-full object-cover" /></button>)}</div></div>
    <div><h1 className="break-words font-display text-6xl font-black uppercase leading-[.75] tracking-[-.09em] sm:text-8xl">{product.name}</h1><p className="mt-7 text-sm leading-7 text-white/65">{product.description}</p><div className="mt-7 grid gap-3 border-y border-white/15 py-5">{product.highlights.map(highlight => <p key={highlight} className="flex gap-2 text-sm text-white/75"><Check className="mt-0.5 size-4 text-[#8bd32c]"/>{highlight}</p>)}</div><div className="mt-7"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-white/45">{copy("Choose a variant", "Variant ရွေးပါ")}</p><div className="mt-3 grid gap-2">{variants.map(variant => <button type="button" key={variant.id} onClick={() => { setSelectedVariantId(variant.id); setReservationKey(null); setNotice(""); }} disabled={variant.stock < 1} className={"flex items-center justify-between border px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[.12em] " + (selectedVariant?.id === variant.id ? "border-[#8bd32c] text-[#8bd32c]" : "border-white/20 text-white/65") + " disabled:cursor-not-allowed disabled:opacity-35"}><span>{variant.label}{variant.size ? " / " + variant.size : ""}{variant.color ? " / " + variant.color : ""}</span><span>{variant.stock} {copy("left", "ကျန်")}</span></button>)}</div></div><div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={reserveSelected} disabled={!selectedVariant || selectedVariant.stock < 1 || reserve.isPending || Boolean(reservationKey)} className="border border-white/40 px-4 py-3 font-mono text-[10px] uppercase tracking-[.18em] hover:border-[#8bd32c] hover:text-[#8bd32c] disabled:opacity-40">{reservationKey ? copy("Reserved", "Reserve ပြီး") : reserve.isPending ? copy("Reserving…", "Reserve လုပ်နေသည်…") : copy("Reserve stock", "Stock reserve လုပ်ရန်")}</button><Link href={checkoutHref} className="bg-[#8bd32c] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-black hover:bg-white">{copy("Continue to checkout", "Checkout သို့ ဆက်ရန်")}</Link></div>{notice && <p className="mt-4 text-sm leading-6 text-[#8bd32c]">{notice}</p>}<p className="mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-white/35">{copy("Reservation is temporary and is consumed when the order is created.", "Reservation သည် ယာယီဖြစ်ပြီး order ဖန်တီးသည့်အခါ consume ပြုလုပ်ပါမည်။")}</p></div></div><section className="mt-14 grid gap-8 border-t border-white/20 pt-8 lg:grid-cols-2"><div><p className="font-display text-4xl font-bold uppercase">{copy("Variants & stock", "Variant နှင့် stock")}</p><p className="mt-4 text-sm leading-6 text-white/55">{copy("Choose one active variant above. Stock is checked again by the server during reservation and order creation.", "အပေါ်တွင် active variant တစ်ခု ရွေးပါ။ Reservation နှင့် order ဖန်တီးချိန်တွင် server က stock ကို ထပ်မံစစ်ဆေးပါမည်။")}</p></div><div><p className="font-display text-4xl font-bold uppercase">{copy("Size chart", "Size chart")}</p><p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/65">{product.sizeChart || copy("Staff can publish product-specific size and fit guidance before launch.", "Staff များသည် launch မတိုင်မီ size နှင့် fit guidance ထည့်နိုင်ပါသည်။")}</p></div></section></div>;
}

`;
source = source.slice(0, start) + replacement + source.slice(end);
fs.writeFileSync(path, source);
