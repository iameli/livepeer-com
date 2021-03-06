import { Root, Overlay, Content } from "@radix-ui/react-dialog";
import { keyframes, styled } from "../stitches.config";
import React from "react";

type DialogProps = React.ComponentProps<typeof Root> & {
  children: React.ReactNode;
};

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const scaleIn = keyframes({
  from: { transform: "translate(-50%, -50%) scale(0.9)" },
  to: { transform: "translate(-50%, -50%) scale(1)" },
});

const fadeout = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const StyledOverlay = styled(Overlay, {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,.35)",
  inset: 0,

  variants: {
    animation: {
      true: {
        '&[data-state="open"]': {
          animation: `${fadeIn} 300ms ease-out`,
        },

        '&[data-state="closed"]': {
          animation: `${fadeout} 200ms ease-out`,
        },
      },
    },
  },
});

export function Dialog({ children, ...props }: DialogProps) {
  return (
    <Root {...props}>
      <StyledOverlay animation />
      {children}
    </Root>
  );
}

const StyledDialogContent = styled(Content, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "85vh",
  padding: "$4",
  marginTop: "-5vh",
  backgroundColor: "$panel",
  borderRadius: "$3",
  boxShadow:
    "$colors$shadowLight 0px 10px 38px -10px, $colors$shadowDark 0px 10px 20px -15px",
  color: "$black",

  "&:focus": {
    outline: "none",
  },

  variants: {
    animation: {
      fade: {
        '&[data-state="open"]': {
          animation: `${fadeIn} 300ms ease-out`,
        },

        '&[data-state="closed"]': {
          animation: `${fadeout} 200ms ease-out`,
        },
      },
      scale: {
        animation: `${fadeIn} 300ms ease-out, ${scaleIn} 200ms ease-out`,
      },
    },
  },
  defaultVariants: {
    animation: "scale",
  },
});

export const DialogContent = ({
  children,
  animation = "scale",
  ...props
}: any) => (
  <StyledDialogContent animation={animation} {...props}>
    {children}
  </StyledDialogContent>
);

export {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
