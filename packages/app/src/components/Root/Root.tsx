import React, { PropsWithChildren } from 'react';
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import GroupIcon from '@material-ui/icons/People';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    orangePeel: {
      main: string;
      dark: string;
    };
    greentheme: {
      offwhite: string;
      green: string;
      orangePeel: string;
      yellow: string;
    };
  }
  interface PaletteOptions {
    orangePeel?: {
      main: string;
      dark: string;
    };
    greentheme?: {
      offwhite: string;
      green: string;
      orangePeel: string;
      yellow: string;
    };
  }
}

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F5F3ED',
    },
    secondary: {
      main: '#1B4F4A',
    },
    orangePeel: {
      main: '#FC661A', // Custom color
      dark: '#B04712',
    },
    greentheme: {
      offwhite: '#F5F3ED',
      green: '#1B4F4A',
      orangePeel: '#FC661A',
      yellow: '#FFB130',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
  overrides: {
    MuiInput: {
      root: {
        color: '#F5F3ED !important',
        '&:before': {
          borderBottomColor: '#F5F3ED !important', // Default bottom border color
        },
        '&:after': {
          borderBottomColor: '#F5F3ED !important', // Bottom border color when focused
        },
        '&:hover:not(.Mui-disabled):before': {
          borderBottomColor: '#F5F3ED !important', // Bottom border color on hover
        },
        '& input': {
          color: '#F5F3ED !important', // Input text color
        },
      },
    },
    MuiInputBase: {
      root: {
        '&::before': {
          borderBottom: '1px solid #f5f3ed',
        },
      },
      input: {
        color: '#f5f3ed',
        fontWeight: 700,
      },
    },
    MuiFormLabel: {
      root: {
        color: '#f5f3ed',
        fontSize: '14px',
      },
    },
    MuiFormHelperText: {
      root: {
        color: '#FFB130',
        fontWeight: 500,
        fontSize: '10px',
      },
    },
    // Override styles for svg if needed
    MuiSvgIcon: {
      root: {
        backgroundColor: 'transparent',
      },
    },
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        <MyGroupsSidebarItem
          singularTitle="My Group"
          pluralTitle="My Groups"
          icon={GroupIcon}
        />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        <SidebarItem
          icon={SportsEsportsIcon}
          to="create-playground"
          text="Playground"
        />
        {/* End global nav */}
        <SidebarDivider />
        <SidebarScrollWrapper>
          {/* Items in this group will be scrollable if they run out of space */}
        </SidebarScrollWrapper>
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </SidebarPage>
);
