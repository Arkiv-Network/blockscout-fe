import { Flex, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxAction, TxActionGeneral, TxActionGolemBase, TxActionUniswap } from 'types/api/txAction';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';

interface Props {
  action: TxAction;
}

function getActionText(actionType: TxActionGeneral['type']) {
  switch (actionType) {
    case 'mint': return [ 'Added', 'liquidity to' ];
    case 'burn': return [ 'Removed', 'liquidity from' ];
    case 'collect': return [ 'Collected', 'from' ];
    case 'swap': return [ 'Swapped', 'on' ];
  }
}

function handleUniswapV3(action: TxActionUniswap) {
  const { type, data } = action;

  switch (type) {
    case 'mint':
    case 'burn':
    case 'collect':
    case 'swap': {
      const amount0 = BigNumber(data.amount0).toFormat();
      const amount1 = BigNumber(data.amount1).toFormat();
      const [ text0, text1 ] = getActionText(type);
      const token0 = {
        address_hash: data.symbol0 === 'Ether' ? '' : data.address0,
        name: data.symbol0 === 'Ether' ? config.chain.currency.symbol || null : data.symbol0,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
      };
      const token1 = {
        address_hash: data.symbol1 === 'Ether' ? '' : data.address1,
        name: data.symbol1 === 'Ether' ? config.chain.currency.symbol || null : data.symbol1,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
      };

      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <chakra.span color="text.secondary">{ text0 }</chakra.span>

          <span>{ amount0 }</span>

          <TokenEntity
            token={ token0 }
            noLink={ data.symbol0 === 'Ether' }
            noCopy
            noIcon
            noSymbol
            w="auto"
            maxW="200px"
            flexShrink={ 0 }
          />

          <chakra.span color="text.secondary">{ type === 'swap' ? 'for' : 'and' }</chakra.span>

          <span>{ amount1 }</span>

          <TokenEntity
            token={ token1 }
            noLink={ data.symbol1 === 'Ether' }
            noIcon
            noCopy
            noSymbol
            w="auto"
            maxW="200px"
            flexShrink={ 0 }
          />

          <chakra.span color="text.secondary">{ text1 }</chakra.span>

          <Flex columnGap={ 2 }>
            <IconSvg name="uniswap" boxSize={ 5 } color="white" bgColor="#ff007a" borderRadius="full" p="2px"/>
            <chakra.span>Uniswap V3</chakra.span>
          </Flex>
        </Flex>
      );
    }

    case 'mint_nft' : {
      const token = {
        address_hash: data.address,
        name: data.name,
        type: 'ERC-20' as const,
        symbol: null,
        icon_url: null,
      };

      return (
        <div>
          <Flex rowGap={ 2 } columnGap={ 2 } flexWrap="wrap" alignItems="center" whiteSpace="pre-wrap" fontWeight={ 500 }>
            <chakra.span color="text.secondary">Minted</chakra.span>

            <TokenEntity
              token={ token }
              noCopy
              w="auto"
              rowGap={ 2 }
            />

            <chakra.span color="text.secondary">to</chakra.span>

            <AddressEntity
              address={{ hash: data.to }}
              truncation="constant"
              noIcon
              noCopy
            />
          </Flex>

          <Flex columnGap={ 1 } rowGap={ 2 } pl={ 3 } flexDirection="column" mt={ 2 } fontWeight={ 500 }>
            {
              data.ids.map((id: string) => {
                return (
                  <Flex key={ data.address + id } whiteSpace="pre-wrap" columnGap={ 2 }>
                    <chakra.span flexShrink={ 0 }>1</chakra.span>
                    <chakra.span color="text.secondary" flexShrink={ 0 }>of token ID</chakra.span>
                    <NftEntity hash={ data.address } id={ id } w="min-content" variant="content"/>
                  </Flex>
                );
              })
            }
          </Flex>
        </div>
      );
    }

    default:
      return null;
  }
}

function handleGolemBase(action: TxActionGolemBase) {
  const { type, data } = action;
  const entity_component = (
    <TxEntity hash={ data.entity_id } truncation="constant" href={ `/golembase/entity/${data.entity_id}` } noIcon noCopy={ false }/>
  );

  switch (type) {
    case 'golembase_entity_created':
      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <chakra.span>Entity created:</chakra.span>
          { entity_component }
          <chakra.span>expiring at block</chakra.span>
          <BlockEntity number={ data.expiration_block } />
        </Flex>
      );
    case 'golembase_entity_updated':
      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <chakra.span>Entity updated:</chakra.span>
          { entity_component }
          <chakra.span>expiring at block</chakra.span>
          <BlockEntity number={ data.expiration_block } />
        </Flex>
      );
    case 'golembase_entity_deleted':
      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <chakra.span>Entity deleted:</chakra.span>
          { entity_component }
        </Flex>
      );
    case 'golembase_entity_ttl_extended':
      return (
        <Flex flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center" fontWeight={ 500 }>
          <chakra.span>Entity lifetime extended:</chakra.span>
          { entity_component }
          <chakra.span>from block</chakra.span>
          <BlockEntity number={ data.old_expiration_block } />
          <chakra.span>to block</chakra.span>
          <BlockEntity number={ data.new_expiration_block } />
        </Flex>
      );
    default:
      return null;
  }
}

const TxDetailsAction = ({ action }: Props) => {
  switch(action.protocol) {
    case 'uniswap_v3':
      return handleUniswapV3(action);
    case 'golembase':
      return handleGolemBase(action);
  }
};

export default React.memo(TxDetailsAction);
