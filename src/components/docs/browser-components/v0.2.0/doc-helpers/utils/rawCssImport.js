// This file provides access to raw CSS content from the imported stylesheets

// Raw content of the skins CSS
export const rawSkins = `@layer components {
  .skin {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-neutral-50);
    --color-background-focus: var(--color-neutral-50);
    --color-background-active: var(--color-neutral-200);

    --color-foreground: var(--color-black);
    --color-foreground-hover: var(--color-neutral-700);
    --color-foreground-focus: var(--color-neutral-700);
    --color-foreground-active: var(--color-neutral-600);

    --color-border: var(--color-black);
    --color-border-hover: var(--color-neutral-300);
    --color-border-focus: var(--color-neutral-400);
    --color-border-active: var(--color-neutral-500);
  }

  .skin-muted {
    --color-background: var(--color-neutral-200);
    --color-background-hover: var(--color-neutral-300);
    --color-background-focus: var(--color-neutral-300);
    --color-background-active: var(--color-neutral-400);

    --color-foreground: var(--color-neutral-700);
    --color-foreground-hover: var(--color-neutral-700);
    --color-foreground-focus: var (--color-neutral-700);
    --color-foreground-active: var (--color-neutral-700);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
  }

  .skin-header {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-primary-hover);
    --color-background-focus: var(--color-primary-600);
    --color-background-active: var(--color-primary-700);

    --color-foreground: var(--color-primary);
    --color-foreground-hover: var(--color-primary-100);
    --color-foreground-focus: var(--color-neutral-100);
    --color-foreground-active: var(--color-neutral-50);

    --color-border: var(--color-primary);
    --color-border-hover: var(--color-primary-100);
    --color-border-focus: var(--color-neutral-100);
    --color-border-active: var(--color-neutral-50);
  }

  .skin-footer {
    --color-background: var(--color-neutral-300);
    --color-background-hover: var(--color-neutral-400);
    --color-background-focus: var(--color-neutral-400);
    --color-background-active: var(--color-neutral-500);

    --color-foreground: var(--color-black);
    --color-foreground-hover: var(--color-neutral-800);
    --color-foreground-focus: var(--color-neutral-800);
    --color-foreground-active: var (--color-neutral-700);

    --color-border: var(--color-neutral-700);
    --color-border-hover: var(--color-neutral-800);
    --color-border-focus: var(--color-neutral-900);
    --color-border-active: var(--color-neutral-1000);
  }

  .skin-card {
    --color-background: var(--color-neutral-100);
    --color-background-hover: var(--color-neutral-200);
    --color-background-focus: var(--color-neutral-200);
    --color-background-active: var(--color-primary-300);

    --color-foreground: var(--color-neutral-900);
    --color-foreground-hover: var(--color-primary-700);
    --color-foreground-focus: var(--color-primary-700);
    --color-foreground-active: var(--color-primary-500);

    --color-border: var (--color-neutral-200);
    --color-border-hover: var(--color-neutral-300);
    --color-border-focus: var(--color-neutral-300);
    --color-border-active: var(--color-primary-500);
  }

  .skin-navigation {
    --color-background: var(--color-primary-900);
    --color-background-hover: var(--color-primary-100);
    --color-background-focus: var(--color-primary-100);
    --color-background-active: var(--color-primary-300);

    --color-foreground: var(--color-white);
    --color-foreground-hover: var(--color-neutral-50);
    --color-foreground-focus: var(--color-neutral-100);
    --color-foreground-active: var(--color-neutral-200);

    --color-border: var(--color-primary-600);
    --color-border-hover: var(--color-primary-700);
    --color-border-focus: var(--color-primary-800);
    --color-border-active: var(--color-primary-900);
  }

  .skin-control {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-neutral-50);
    --color-background-focus: var(--color-neutral-100);
    --color-background-active: var(--color-neutral-200);

    --color-foreground: var(--color-neutral-900);
    --color-foreground-hover: var(--color-neutral-800);
    --color-foreground-focus: var(--color-neutral-700);

    --color-border: var(--color-neutral-300);
    --color-border-hover: var(--color-neutral-400);
    --color-border-focus: var(--color-neutral-500);
    --color-border-active: var(--color-neutral-600);
  }

  .skin-modal {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-neutral-50);
    --color-background-focus: var(--color-neutral-100);
    --color-background-active: var(--color-neutral-200);

    --color-foreground: var(--color-neutral-900);
    --color-foreground-hover: var(--color-neutral-700);
    --color-foreground-focus: var(--color-neutral-700);
    --color-foreground-active: var(--color-neutral-600);

    --color-border: var(--color-neutral-200);
    --color-border-hover: var(--color-neutral-300);
    --color-border-focus: var(--color-neutral-400);
    --color-border-active: var(--color-neutral-500);
  }

  .skin-container {
    --color-background: var(--color-neutral-50);
    --color-background-hover: var(--color-neutral-100);
    --color-background-focus: var(--color-neutral-200);
    --color-background-active: var(--color-neutral-300);

    --color-foreground: var(--color-neutral-900);
    --color-foreground-hover: var(--color-neutral-800);
    --color-foreground-focus: var(--color-neutral-700);
    --color-foreground-active: var(--color-neutral-600);

    --color-border: var(--color-neutral-200);
    --color-border-hover: var(--color-neutral-300);
    --color-border-focus: var(--color-neutral-400);
    --color-border-active: var(--color-neutral-500);
  }

  .skin-attention {
    --color-background: var(--color-attention-50);
    --color-background-hover: var(--color-attention-100);
    --color-background-focus: var(--color-attention-200);
    --color-background-active: var(--color-attention-300);

    --color-foreground: var(--color-attention-500);
    --color-foreground-hover: var(--color-attention-600);
    --color-foreground-focus: var(--color-attention-700);
    --color-foreground-active: var(--color-attention-800);

    --color-border: var(--color-attention-300);
    --color-border-hover: var(--color-attention-400);
    --color-border-focus: var(--color-attention-500);
    --color-border-active: var(--color-attention-600);
  }

  .skin-primary-emphasised {
    --color-background: var(--color-primary);
    --color-background-hover: var(--color-primary-600);
    --color-background-focus: var(--color-primary-600);
    --color-background-active: var(--color-primary-700);
    --color-background-disabled: var(--color-primary-200);

    --color-foreground: var(--color-white);
    --color-foreground-hover: var(--color-white);
    --color-foreground-focus: var(--color-white);
    --color-foreground-active: var(--color-white);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-primary {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-primary-50);
    --color-background-focus: var(--color-primary-50);
    --color-background-active: var(--color-primary-100);
    --color-background-disabled: var(--color-neutral-50);

    --color-foreground: var(--color-primary);
    --color-foreground-hover: var(--color-primary-600);
    --color-foreground-focus: var(--color-primary-600);
    --color-foreground-active: var(--color-primary-700);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: var(--color-primary);
    --color-border-hover: var(--color-primary-600);
    --color-border-focus: var(--color-primary-600);
    --color-border-active: var(--color-primary-700);
    --color-border-disabled: var(--color-neutral-200);
  }

  .skin-primary-subtle {
    --color-background: transparent;
    --color-background-hover: var(--color-primary-50);
    --color-background-focus: var(--color-primary-50);
    --color-background-active: var(--color-primary-100);
    --color-background-disabled: transparent;

    --color-foreground: var(--color-primary);
    --color-foreground-hover: var(--color-primary-600);
    --color-foreground-focus: var(--color-primary-600);
    --color-foreground-active: var(--color-primary-700);
    --color-foreground-disabled: var(--color-neutral-300);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-secondary-emphasised {
    --color-background: var(--color-secondary);
    --color-background-hover: var(--color-secondary-600);
    --color-background-focus: var(--color-secondary-600);
    --color-background-active: var(--color-secondary-700);
    --color-background-disabled: var(--color-secondary-200);

    --color-foreground: var(--color-white);
    --color-foreground-hover: var(--color-white);
    --color-foreground-focus: var(--color-white);
    --color-foreground-active: var(--color-white);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-secondary {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-secondary-50);
    --color-background-focus: var(--color-secondary-50);
    --color-background-active: var(--color-secondary-100);
    --color-background-disabled: var(--color-neutral-50);

    --color-foreground: var(--color-secondary);
    --color-foreground-hover: var (--color-secondary-600);
    --color-foreground-focus: var(--color-secondary-600);
    --color-foreground-active: var(--color-secondary-700);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: var(--color-secondary);
    --color-border-hover: var(--color-secondary-600);
    --color-border-focus: var(--color-secondary-600);
    --color-border-active: var(--color-secondary-700);
    --color-border-disabled: var(--color-neutral-200);
  }

  .skin-secondary-subtle {
    --color-background: transparent;
    --color-background-hover: var(--color-secondary-50);
    --color-background-focus: var(--color-secondary-50);
    --color-background-active: var(--color-secondary-100);
    --color-background-disabled: transparent;

    --color-foreground: var(--color-secondary);
    --color-foreground-hover: var(--color-secondary-600);
    --color-foreground-focus: var(--color-secondary-600);
    --color-foreground-active: var(--color-secondary-700);
    --color-foreground-disabled: var(--color-neutral-300);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-tertiary-emphasised {
    --color-background: var(--color-tertiary);
    --color-background-hover: var(--color-tertiary-600);
    --color-background-focus: var(--color-tertiary-600);
    --color-background-active: var(--color-tertiary-700);
    --color-background-disabled: var(--color-tertiary-200);

    --color-foreground: var(--color-white);
    --color-foreground-hover: var(--color-white);
    --color-foreground-focus: var(--color-white);
    --color-foreground-active: var(--color-white);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-tertiary {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-tertiary-50);
    --color-background-focus: var(--color-tertiary-50);
    --color-background-active: var (--color-tertiary-100);
    --color-background-disabled: var(--color-neutral-50);

    --color-foreground: var(--color-tertiary);
    --color-foreground-hover: var(--color-tertiary-600);
    --color-foreground-focus: var(--color-tertiary-600);
    --color-foreground-active: var(--color-tertiary-700);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: var(--color-tertiary);
    --color-border-hover: var(--color-tertiary-600);
    --color-border-focus: var(--color-tertiary-600);
    --color-border-active: var(--color-tertiary-700);
    --color-border-disabled: var(--color-neutral-200);
  }

  .skin-tertiary-subtle {
    --color-background: transparent;
    --color-background-hover: var(--color-tertiary-50);
    --color-background-focus: var(--color-tertiary-50);
    --color-background-active: var(--color-tertiary-100);
    --color-background-disabled: transparent;

    --color-foreground: var(--color-tertiary);
    --color-foreground-hover: var(--color-tertiary-600);
    --color-foreground-focus: var(--color-tertiary-600);
    --color-foreground-active: var(--color-tertiary-700);
    --color-foreground-disabled: var(--color-neutral-300);

    --color-border: transparent;
    --color-border-hover: transparent;
    --color-border-focus: transparent;
    --color-border-active: transparent;
    --color-border-disabled: transparent;
  }

  .skin-success {
    --color-background: var(--color-success-light);
    --color-background-hover: var(--color-success-100);
    --color-background-focus: var(--color-success-200);
    --color-background-active: var(--color-success-300);

    --color-foreground: var(--color-success);
    --color-foreground-hover: var(--color-success-600);
    --color-foreground-focus: var(--color-success-700);
    --color-foreground-active: var(--color-success-800);

    --color-border: var(--color-success-300);
    --color-border-hover: var (--color-success-400);
    --color-border-focus: var(--color-success-500);
    --color-border-active: var(--color-success-600);
  }

  .skin-error {
    --color-background: var(--color-error-light);
    --color-background-hover: var(--color-error-100);
    --color-background-focus: var(--color-error-200);
    --color-background-active: var(--color-error-300);

    --color-foreground: var(--color-error);
    --color-foreground-hover: var(--color-error-600);
    --color-foreground-focus: var(--color-error-700);
    --color-foreground-active: var(--color-error-800);

    --color-border: var(--color-error-300);
    --color-border-hover: var(--color-error-400);
    --color-border-focus: var(--color-error-500);
    --color-border-active: var(--color-error-600);
  }

  .skin-inactive {
    --color-background: var(--color-neutral-100);
    --color-background-hover: var(--color-neutral-200);
    --color-background-focus: var(--color-neutral-300);
    --color-background-active: var(--color-neutral-400);

    --color-foreground: var(--color-neutral-500);
    --color-foreground-hover: var(--color-neutral-600);
    --color-foreground-focus: var(--color-neutral-700);
    --color-foreground-active: var(--color-neutral-800);

    --color-border: var(--color-neutral-300);
    --color-border-hover: var(--color-neutral-400);
    --color-border-focus: var(--color-neutral-500);
    --color-border-active: var(--color-neutral-600);
  }

  .skin-form {
    --color-background: var(--color-white);
    --color-background-hover: var(--color-neutral-100);
    --color-background-focus: var(--color-neutral-50);
    --color-background-active: var(--color-neutral-50);
    --color-background-disabled: var(--color-white);

    --color-foreground: var(--color-black);
    --color-foreground-hover: var(--color-black);
    --color-foreground-focus: var(--color-black);
    --color-foreground-active: var(--color-black);
    --color-foreground-disabled: var(--color-neutral-400);

    --color-border: var(--color-neutral-300);
    --color-border-hover: var(--color-primary-700);
    --color-border-focus: var(--color-primary-700);
    --color-border-active: var(--color-primary-800);
    --color-border-disabled: var(--color-neutral-400);
  }
}
`;
