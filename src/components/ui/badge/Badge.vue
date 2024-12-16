<script setup>
import { cn } from '@/lib/utils';
import { badgeVariants } from '.';

const props = defineProps({
  variant: { type: null, required: false },
  class: { type: null, required: false },
});

const variants = {
  default: "bg-primary/10 text-primary hover:bg-primary/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-400",
  info: "bg-sky-100 text-sky-700 dark:bg-sky-700/20 dark:text-sky-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-700/20 dark:text-amber-400",
  premium: "bg-violet-100 text-violet-700 dark:bg-violet-700/20 dark:text-violet-400"
}
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
