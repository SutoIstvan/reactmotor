import { Head, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    FileText,
    Image as ImageIcon,
    Layers,
    Link as LinkIcon,
    Loader2,
    Save,
    Trash2,
    Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { update } from '@/routes/admin/pages';
import type { BreadcrumbItem } from '@/types';

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        const token = metaTag.getAttribute('content');
        if (token) return token;
    }
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

interface ImageUploadFieldProps {
    id: string;
    label: string;
    fieldKey: string;
    value: string;
    onChange: (value: string) => void;
}

function ImageUploadField({
    id,
    label,
    fieldKey,
    value,
    onChange,
}: ImageUploadFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset so selecting the same file triggers change if desired
        e.target.value = '';

        if (file.size > 10 * 1024 * 1024) {
            setUploadError('A fájl mérete nem haladhatja meg a 10 MB-ot.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('image', file);

        const csrfToken = getCsrfToken();

        try {
            const response = await fetch('/admin/upload-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a kép feltöltése során.');
            }

            if (data.url) {
                onChange(data.url);
            }
        } catch (err: any) {
            setUploadError(err.message || 'A kép feltöltése sikertelen volt.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="rounded-xl border bg-card/60 p-3.5 space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors h-full">
            <div>
                {/* Header with field label & key */}
                <div className="flex items-start justify-between gap-2 mb-2 min-h-[36px]">
                    <Label
                        htmlFor={id}
                        className="text-xs font-semibold text-foreground line-clamp-2 leading-snug"
                        title={label}
                    >
                        {label}
                    </Label>
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 shrink-0 text-muted-foreground">
                        {fieldKey}
                    </Badge>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Preview Box */}
                <div className="relative w-full h-44 rounded-lg border bg-muted/30 overflow-hidden flex items-center justify-center group shadow-xs">
                    {value ? (
                        <>
                            <img
                                src={value}
                                alt={label}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.opacity = '0.3';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-xs px-3 shadow"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    <Upload className="h-3.5 w-3.5 mr-1" />
                                    Csere
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-xs px-2.5 shadow"
                                    onClick={() => onChange('')}
                                    disabled={isUploading}
                                    title="Törlés"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground p-3 text-center">
                            <ImageIcon className="h-10 w-10 stroke-[1.25] mb-2 text-muted-foreground/40" />
                            <span className="text-xs font-medium">Nincs kép feltöltve</span>
                            <span className="text-[10px] text-muted-foreground/75 mt-0.5">Kattintson a feltöltéshez</span>
                        </div>
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-xs">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-xs font-medium">Feltöltés folyamatban...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-xs flex-1 h-8"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                Feltöltés...
                            </>
                        ) : (
                            <>
                                <Upload className="h-3.5 w-3.5 mr-1.5" />
                                {value ? 'Kép módosítása' : 'Kép feltöltése'}
                            </>
                        )}
                    </Button>

                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onChange('')}
                            disabled={isUploading}
                            className="text-xs text-destructive hover:text-destructive h-8 px-2"
                            title="Kép törlése"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                        title={showUrlInput ? 'URL elrejtése' : 'Kép URL megadása'}
                    >
                        <LinkIcon className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {showUrlInput && (
                    <div className="pt-1">
                        <Input
                            id={id}
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://... vagy /storage/..."
                            className="text-xs h-7 font-mono"
                        />
                    </div>
                )}

                {uploadError && (
                    <p className="text-xs text-destructive font-medium leading-tight">
                        {uploadError}
                    </p>
                )}
            </div>
        </div>
    );
}

interface FieldConfig {
    label: string;
    type: 'text' | 'textarea' | 'image';
}

interface SectionConfig {
    label: string;
    fields: Record<string, FieldConfig>;
}

interface PageContentProps {
    page: string;
    pageLabel: string;
    sections: Record<string, SectionConfig>;
    contents: Record<string, Record<string, string>>;
}

export default function PageContent({
    page,
    pageLabel,
    sections,
    contents,
}: PageContentProps) {
    // Keep track of which section cards are open. Default all open.
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        Object.keys(sections).forEach((key) => {
            initial[key] = true;
        });
        return initial;
    });

    const toggleSection = (key: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const expandAll = () => {
        const updated: Record<string, boolean> = {};
        Object.keys(sections).forEach((key) => {
            updated[key] = true;
        });
        setOpenSections(updated);
    };

    const collapseAll = () => {
        const updated: Record<string, boolean> = {};
        Object.keys(sections).forEach((key) => {
            updated[key] = false;
        });
        setOpenSections(updated);
    };

    // Prepare initial form data based on section configs and existing contents
    const initialSectionsData: Record<string, Record<string, string>> = {};
    Object.entries(sections).forEach(([sectionKey, sectionConfig]) => {
        initialSectionsData[sectionKey] = {};
        Object.keys(sectionConfig.fields).forEach((fieldKey) => {
            initialSectionsData[sectionKey][fieldKey] =
                contents[sectionKey]?.[fieldKey] ?? '';
        });
    });

    const { data, setData, put, processing, recentlySuccessful, isDirty } =
        useForm<{
            sections: Record<string, Record<string, string>>;
        }>({
            sections: initialSectionsData,
        });

    const handleFieldChange = (
        sectionKey: string,
        fieldKey: string,
        value: string
    ) => {
        setData('sections', {
            ...data.sections,
            [sectionKey]: {
                ...(data.sections[sectionKey] || {}),
                [fieldKey]: value,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url({ page }), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`${pageLabel} - Tartalom szerkesztése`} />

            <div className="container max-w-5xl py-6 px-4 md:px-8 space-y-6">
                {/* Header banner */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {pageLabel} — Tartalom szerkesztése
                            </h1>
                            <Badge variant="secondary" className="font-mono text-xs">
                                {page}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Itt módosíthatja a(z) {pageLabel.toLowerCase()} szöveges elemeit, címeit, leírásait és gombfeliratait.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openSections[Object.keys(sections)[0]] ? collapseAll : expandAll}
                        >
                            <Layers className="h-4 w-4 mr-1.5" />
                            {openSections[Object.keys(sections)[0]] ? 'Összes becsukása' : 'Összes kinyitása'}
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="min-w-[140px]"
                        >
                            {processing ? (
                                'Mentés...'
                            ) : recentlySuccessful ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" />
                                    Mentve!
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-1.5" />
                                    Mentés
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Status indicator */}
                {recentlySuccessful && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>A módosítások sikeresen mentve lettek az adatbázisba! A főoldal azonnal frissült.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(sections).map(([sectionKey, sectionConfig]) => {
                        const isOpen = openSections[sectionKey] ?? true;
                        const fields = sectionConfig.fields;
                        const fieldKeys = Object.keys(fields);

                        return (
                            <Collapsible
                                key={sectionKey}
                                open={isOpen}
                                onOpenChange={() => toggleSection(sectionKey)}
                            >
                                <Card className="transition-shadow hover:shadow-md">
                                    <CollapsibleTrigger asChild>
                                        <CardHeader className="cursor-pointer select-none border-b bg-muted/30 hover:bg-muted/50 transition-colors py-4 px-6 flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">
                                                        {sectionConfig.label}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                                                        Azonosító: <code className="font-mono">{sectionKey}</code> • {fieldKeys.length} szerkeszthető mező
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {sectionKey}
                                                </Badge>
                                                {isOpen ? (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                        </CardHeader>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <CardContent className="p-6 space-y-6">
                                            {(() => {
                                                const regularFields = Object.entries(fields).filter(
                                                    ([_, def]) => def.type !== 'image'
                                                );
                                                const imageFields = Object.entries(fields).filter(
                                                    ([_, def]) => def.type === 'image'
                                                );

                                                const imageGridClass =
                                                    imageFields.length === 1
                                                        ? 'grid-cols-1'
                                                        : imageFields.length === 2
                                                        ? 'grid-cols-1 md:grid-cols-2'
                                                        : 'grid-cols-1 md:grid-cols-3';

                                                return (
                                                    <>
                                                        {regularFields.length > 0 && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {regularFields.map(([fieldKey, fieldDef]) => {
                                                                    const value =
                                                                        data.sections[sectionKey]?.[fieldKey] ?? '';
                                                                    const isFullWidth =
                                                                        fieldDef.type === 'textarea' ||
                                                                        fieldKey === 'subtitle' ||
                                                                        fieldKey === 'description';

                                                                    return (
                                                                        <div
                                                                            key={fieldKey}
                                                                            className={`space-y-1.5 ${
                                                                                isFullWidth
                                                                                    ? 'md:col-span-2'
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <Label
                                                                                    htmlFor={`${sectionKey}_${fieldKey}`}
                                                                                    className="text-xs font-medium text-foreground"
                                                                                >
                                                                                    {fieldDef.label}
                                                                                </Label>
                                                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                                                    {fieldKey}
                                                                                </span>
                                                                            </div>

                                                                            {fieldDef.type === 'textarea' ? (
                                                                                <Textarea
                                                                                    id={`${sectionKey}_${fieldKey}`}
                                                                                    rows={3}
                                                                                    value={value}
                                                                                    onChange={(e) =>
                                                                                        handleFieldChange(
                                                                                            sectionKey,
                                                                                            fieldKey,
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    placeholder={`${fieldDef.label}...`}
                                                                                    className="resize-y"
                                                                                />
                                                                            ) : (
                                                                                <Input
                                                                                    id={`${sectionKey}_${fieldKey}`}
                                                                                    type="text"
                                                                                    value={value}
                                                                                    onChange={(e) =>
                                                                                        handleFieldChange(
                                                                                            sectionKey,
                                                                                            fieldKey,
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                    placeholder={`${fieldDef.label}...`}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {imageFields.length > 0 && (
                                                            <div className="pt-4 border-t space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <ImageIcon className="h-4 w-4 text-primary" />
                                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                            Képek feltöltése ({imageFields.length} db fotó)
                                                                        </h4>
                                                                    </div>
                                                                    <span className="text-[11px] text-muted-foreground">
                                                                        Egy sorban elhelyezett fotók
                                                                    </span>
                                                                </div>

                                                                <div className={`grid ${imageGridClass} gap-4`}>
                                                                    {imageFields.map(([fieldKey, fieldDef]) => {
                                                                        const value =
                                                                            data.sections[sectionKey]?.[fieldKey] ?? '';

                                                                        return (
                                                                            <ImageUploadField
                                                                                key={fieldKey}
                                                                                id={`${sectionKey}_${fieldKey}`}
                                                                                label={fieldDef.label}
                                                                                fieldKey={fieldKey}
                                                                                value={value}
                                                                                onChange={(newVal) =>
                                                                                    handleFieldChange(
                                                                                        sectionKey,
                                                                                        fieldKey,
                                                                                        newVal
                                                                                    )
                                                                                }
                                                                            />
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        );
                    })}

                    {/* Bottom Save Bar */}
                    <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border bg-card/95 backdrop-blur-sm p-4 shadow-lg">
                        <div className="text-xs text-muted-foreground">
                            {isDirty ? (
                                <span className="text-amber-500 font-medium">
                                    Nem mentett módosítások vannak!
                                </span>
                            ) : (
                                <span>Minden módosítás mentve.</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-[140px]"
                            >
                                {processing ? (
                                    'Mentés...'
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-1.5" />
                                        Módosítások mentése
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

PageContent.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Tartalom kezelés',
            href: '/admin/pages/home',
        },
    ] as BreadcrumbItem[],
};
