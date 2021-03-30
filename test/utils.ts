import { ethers } from 'ethers'

/**
 * @dev Synthetix's helper function for `assertRevertOptimism`.
 */
function _hexToString(hex: string) {
  let str = ''

  const terminator = '**zÛ'

  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))

    if (str.includes(terminator)) {
      break
    }
  }

  return str.substring(0, str.length - 4)
}

/**
 * @dev Synthetix's helper function for `assertRevertOptimism`.
 */
async function getOptimismRevertReason({ tx, provider }) {
  try {
    let code: any = await provider.call(tx)
    code = code.substr(138)

    // Try to parse the revert reason bytes.
    let reason: string

    if (code.length === 64) {
      reason = ethers.utils.parseBytes32String(`0x${ code }`)
    } else {
      reason = _hexToString(`0x${ code }`)
    }

    return reason
  } catch (suberror) {
    throw new Error(`Unable to parse revert reason: ${ suberror }`)
  }
}

/**
 * @dev Synthetix's utility function to retreive revert reasons for function
 *      calls in the OVM.
 */
async function assertRevertOptimism({ tx, reason, provider }) {
  let receipt: any, revertReason: string | any[]

  try {
    receipt = await tx.wait()
  } catch (error) {
    revertReason = await getOptimismRevertReason({ tx, provider })
  }

  if (receipt) {
    throw new Error(
      `Transaction was expected to revert with "${ reason }", but it did not revert.`
    )
  } else {
    if (!revertReason.includes(reason)) {
      throw new Error(
        `Transaction was expected to revert with "${ reason }", but it reverted with "${ revertReason }" instead.`
      )
    }
  }
}

function getArtifact(testMode: string) {
  const buildFolder = (testMode === 'OVM') ? 'build-ovm' : 'build'
  const ERC20Artifact = require(`../${ buildFolder }/ERC20.json`)

  return ERC20Artifact
}

export { assertRevertOptimism, getArtifact }
