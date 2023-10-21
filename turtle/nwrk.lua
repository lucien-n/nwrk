local running = true

local port = 8080
local host = "localhost"
local url = "ws://" .. host .. ":" .. port

function turtle.getFuelPercentage()
    local max = turtle.getFuelLimit()
    local level = turtle.getFuelLevel()

    local percentage = ((max - level) / max) * 100

    return true, percentage
end

function turtle.getInventory()
    local inventory = {}
    for i = 1, 16 do
        local slot = turtle.getItemDetail(i)
        if slot then
            inventory[i] = slot
        else
            inventory[i] = {}
        end
    end
    return true, inventory
end

function turtle.getWorld()
    local world = { nil, nil, nil }

    local _, inspect = turtle.inspect()
    if inspect then world[1] = inspect end
    local _, inspect_up = turtle.inspectUp()
    if inspect_up then world[2] = inspect_up end
    local _, inspect_down = turtle.inspectDown()
    if inspect_down then world[3] = inspect_down end

    return true, world
end

local function turtle_restart(cooldown)
    local x, y = term.getCursorPos()
    if not cooldown then cooldown = 15 end
    for i = 0, cooldown do
        term.setCursorPos(x, y)
        term.clearLine()
        term.write("Turtle disconnected, rebooting in " .. cooldown - i .. "s")
        os.sleep(1)
    end
    os.reboot()
end

local function main_loop(ws)
    local rcv_success, msg = pcall(ws.receive)
    if rcv_success then
        if msg then
            local data = textutils.unserialiseJSON(msg)
            if data.type == "eval" then
                local f = load("return " .. data["function"])
                if f then
                    local exec_success, func_success, func_result = pcall(f)
                    if exec_success then
                        print(">", data["reqId"], data["function"], func_success)
                        ws.send(textutils.serialiseJSON({
                            type = "response",
                            success = func_success,
                            result = func_result,
                            reqId = data["reqId"]
                        }))
                    else
                        print("!>", data["function"])
                    end
                end
            end
        end
    else
        turtle_restart()
    end
end

local function run()
    term.clear()
    term.setCursorPos(1, 1)

    local _, ws = pcall(http.websocket, url)
    if not ws then
        running = false
        print("Error while connecting to socket")
        turtle_restart()
    end
    print("Connected to", url)

    -- ? Auth
    ws.send(textutils.serialiseJSON({
        id = "turtle",
        cmd = "auth",
        content = {
            id = os.getComputerID(),
            fuelLevel = turtle.getFuelLevel()
        }
    }))

    while running do
        main_loop(ws)
    end
end

run()
